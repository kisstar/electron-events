import { BrowserWindow, ipcMain } from 'electron';
import { isArray, isFunction, isString } from 'lodash';
import { windowPool } from '../base';
import { IpcEvents } from '../models';
import {
  ANY_WINDOW_SYMBOL,
  SELF_NAME,
  DEFAULT_TIMEOUT,
  ErrorCode,
  EventType,
  EVENT_CENTER,
  getUUID,
  MAIN_EVENT_NAME
} from '../utils';
import type { IpcEventIdentifier, IpcEventArgs } from '../models';

interface MainEventCenterParams {
  type?: EventType;
  timeout?: number;
  toName: string | string[];
  eventName: string | string[];
  payload: any[];
}

interface HandlerParams {
  code: number;
  message: string;
  payload?: any[];
}

interface ResponseArray {
  isSingleToName?: boolean;
  isSingleEventName?: boolean;
  resArr: (never[] | Promise<unknown>)[];
}

export class MainIpcEvents extends IpcEvents {
  constructor() {
    super();

    ipcMain.handle(EVENT_CENTER, (event, params: MainEventCenterParams) => {
      const window = BrowserWindow.fromWebContents(event.sender);

      if (!window) {
        return;
      }

      const windowName = windowPool.getName(window.id);
      let { toName, type = EventType.NORMAL, eventName } = params;

      if (!windowName) {
        return;
      }
      if (ANY_WINDOW_SYMBOL === toName) {
        toName = windowPool.getAllNames();
        // .filter(winName => winName !== windowName); // Exclude sender
        toName.unshift(MAIN_EVENT_NAME);
      }

      const isSingleToName = isString(toName);
      const isSingleEventName = isString(eventName);

      if (!isArray(toName)) {
        toName = [toName];
      }

      if (EventType.NORMAL === type) {
        return this._handleNormalEvent(windowName, toName, params);
      } else {
        return this._handleResponsiveEvent(windowName, toName, params, {
          isSingleToName,
          isSingleEventName
        });
      }
    });
  }

  addWindow(name: string, bw: BrowserWindow) {
    return windowPool.add(name, bw);
  }

  removeWindow(idOrname: string | number) {
    return windowPool.remove(idOrname);
  }

  private _handleNormalEvent(
    fromName: string,
    toName: string[],
    params: MainEventCenterParams
  ) {
    let { eventName, payload } = params;

    toName.forEach(winName => {
      if (MAIN_EVENT_NAME === winName) {
        if (!isArray(eventName)) {
          eventName = [eventName];
        }

        eventName.forEach(evName => {
          const resEventName = this._getEventName(fromName, evName);
          const anyEventName = this._getEventName(ANY_WINDOW_SYMBOL, evName);

          this.eventMap.emit(resEventName, ...payload);
          this.eventMap.emit(anyEventName, ...payload);
        });
        return;
      }

      const toWindow = windowPool.get(winName);

      if (!toWindow) {
        return;
      }

      toWindow.webContents.send(EVENT_CENTER, {
        fromName: fromName === winName ? SELF_NAME : fromName,
        eventName,
        payload
      });
    });
  }

  private _handleResponsiveEvent(
    fromName: string,
    toName: string[],
    params: MainEventCenterParams,
    { isSingleToName = false, isSingleEventName = false }
  ) {
    let { eventName, payload } = params;

    const resOutArr = toName.map(winName => {
      if (MAIN_EVENT_NAME === winName) {
        if (!isArray(eventName)) {
          eventName = [eventName];
        }

        const resFromName = fromName === winName ? SELF_NAME : fromName;
        const resInArr = eventName.map(evName => {
          const resEventName = this._getEventName(resFromName, evName);
          const anyEventName = this._getEventName(ANY_WINDOW_SYMBOL, evName);
          const handler =
            this.responsiveEventMap.get(resEventName) ||
            this.responsiveEventMap.get(anyEventName);

          if (!isFunction(handler)) {
            return Promise.reject(
              new Error(
                `Error occurred in handler for '${evName}': No handler registered for '${evName}'`
              )
            );
          }

          return handler(...payload);
        });

        return Promise.all(resInArr);
      }

      return this._listenRenderer(fromName, winName, params);
    });

    return this._getResponse({
      isSingleToName,
      isSingleEventName,
      resArr: resOutArr
    });
  }

  private _listenRenderer(
    fromName: string,
    toName: string,
    params: MainEventCenterParams
  ) {
    const toWindow = windowPool.get(toName);
    let { eventName, payload, timeout = DEFAULT_TIMEOUT } = params;

    if (!toWindow) {
      return [];
    }

    const handlerName = getUUID();
    const eventPromise = new Promise((res, rej) => {
      const tid = setTimeout(() => {
        rej({
          code: ErrorCode.OVERTIME,
          message: new Error(
            `Listen to the response of window ${toName} timeout`
          )
        });
      }, timeout);

      ipcMain.handleOnce(handlerName, (_, params: HandlerParams) => {
        const { code, message, payload: data } = params;

        clearTimeout(tid);

        if (code === ErrorCode.SUCCESS) {
          res(data);
        } else {
          rej(message);
        }
      });
    });

    toWindow.webContents.send(EVENT_CENTER, {
      type: EventType.RESPONSIVE,
      handlerName,
      fromName: fromName === toName ? SELF_NAME : fromName,
      eventName,
      payload
    });

    return eventPromise;
  }

  private _getResponse({
    isSingleToName,
    isSingleEventName,
    resArr
  }: ResponseArray) {
    const result = Promise.all<any[]>(resArr);

    if (isSingleToName && isSingleEventName) {
      return result.then(([innderRes]) => innderRes[0]);
    } else if (isSingleToName) {
      return result.then(([innderRes]) => innderRes);
    } else if (isSingleEventName) {
      return result.then(res => res.map(innderRes => innderRes[0]));
    } else {
      return result;
    }
  }

  emitTo<K extends IpcEventIdentifier = IpcEventIdentifier>(
    windowName: string | string[],
    eventName: K,
    ...args: IpcEventArgs<K>
  ) {
    if (ANY_WINDOW_SYMBOL === windowName) {
      windowName = windowPool.getAllNames();
      this.emit(eventName, ...args);
    }
    if (!isArray(windowName)) {
      windowName = [windowName];
    }

    windowName.forEach(winName => {
      const toWindow = windowPool.get(winName);

      if (!toWindow) {
        return;
      }

      toWindow.webContents.send(EVENT_CENTER, {
        fromName: MAIN_EVENT_NAME,
        eventName,
        payload: args
      });
    });
  }

  invokeTo<K extends IpcEventIdentifier = IpcEventIdentifier>(
    windowName: string | string[],
    eventName: K,
    ...args: IpcEventArgs<K>
  ) {
    if (ANY_WINDOW_SYMBOL === windowName) {
      windowName = windowPool.getAllNames();
      windowName.unshift(MAIN_EVENT_NAME);
    }

    const isSingleToName = isString(windowName);
    const isSingleEventName = isString(eventName);
    const eventNames = [];

    if (!isArray(windowName)) {
      windowName = [windowName];
    }
    if (isString(eventName)) {
      eventNames.push(eventName);
    } else if (isArray(eventName)) {
      eventNames.push(...eventName);
    }

    return this._handleResponsiveEvent(
      MAIN_EVENT_NAME,
      windowName,
      {
        type: EventType.RESPONSIVE,
        toName: windowName,
        eventName: eventNames,
        payload: args
      },
      {
        isSingleToName,
        isSingleEventName
      }
    );
  }
}
