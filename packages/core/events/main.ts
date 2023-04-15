import { BrowserWindow, ipcMain } from 'electron';
import { isArray, isFunction, isString } from 'lodash';
import { windowPool } from '../base';
import { IpcEvents } from '../models';
import {
  ANY_WINDOW_SYMBOL,
  DEFAULT_TIMEOUT,
  ErrorCode,
  EventType,
  EVENT_CENTER,
  getUUID,
  MAIN_EVENT_NAME
} from '../utils';

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
        toName = windowPool
          .getAllNames()
          .filter(winName => winName !== windowName);
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
        fromName,
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

        const resInArr = eventName.map(evName => {
          const resEventName = this._getEventName(fromName, evName);
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
      fromName,
      eventName,
      payload
    });

    return eventPromise;
  }

  private _getResponse({ isSingleToName, isSingleEventName, resArr }: ResponseArray) {
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

  emitTo(
    windowName: string | string[],
    eventName: string | string[],
    ...args: any[]
  ) {
    if (ANY_WINDOW_SYMBOL === windowName) {
      windowName = windowPool.getAllNames();
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

  invokeTo(
    windowName: string | string[],
    eventName: string | string[],
    ...args: any[]
  ) {
    if (ANY_WINDOW_SYMBOL === windowName) {
      windowName = windowPool.getAllNames();
    }

    const isSingleToName = isString(windowName);
    const isSingleEventName = isString(eventName);

    if (!isArray(windowName)) {
      windowName = [windowName];
    }

    const resArr = windowName.map(winName => {
      return this._listenRenderer(MAIN_EVENT_NAME, winName, {
        type: EventType.RESPONSIVE,
        toName: windowName,
        eventName,
        payload: args
      });
    });

    return this._getResponse({
      isSingleToName,
      isSingleEventName,
      resArr
    });
  }
}
