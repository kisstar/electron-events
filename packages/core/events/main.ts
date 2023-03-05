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
  payload?: any;
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
        toName.unshift(MAIN_EVENT_NAME);
      }

      const isSingle = isString(toName) && isString(eventName);

      if (!isArray(toName)) {
        toName = [toName];
      }

      if (EventType.NORMAL === type) {
        return this._handleNormalEvent(windowName, toName, params);
      } else {
        return this._handleResponsiveEvent(
          windowName,
          toName,
          params,
          isSingle
        );
      }
    });
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
    isSingle: boolean = false
  ) {
    let { eventName, payload, timeout = DEFAULT_TIMEOUT } = params;

    const resOutArr = toName.map(winName => {
      if (MAIN_EVENT_NAME === winName) {
        if (!isArray(eventName)) {
          eventName = [eventName];
        }

        const resInArr = eventName.map(evName => {
          const resEventName = this._getEventName(fromName, evName);
          const handler = this.responsiveEventMap.get(resEventName);

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

      const toWindow = windowPool.get(winName);

      if (!toWindow) {
        return;
      }

      const handlerName = getUUID();
      const eventPromise = new Promise((res, rej) => {
        const tid = setTimeout(() => {
          rej({
            code: ErrorCode.OVERTIME,
            message: new Error(
              `Listen to the response of window ${winName} timeout`
            )
          });
        }, timeout);

        ipcMain.handleOnce(handlerName, (_, params: HandlerParams) => {
          const { code, message, payload: data } = params;

          clearTimeout(tid);

          if (code === ErrorCode.SUCCESS) {
            res(data);
          } else {
            rej(data || message);
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
    });

    if (isSingle) {
      return Promise.all<any[]>(resOutArr).then(([res]) => res[0]);
    } else {
      return Promise.all(resOutArr);
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

  handle(eventName: string | string[], listener: AnyFunction): this;
  handle(
    windowName: string | string[],
    eventName: string | string[],
    listener: AnyFunction
  ): this;
  handle(
    windowName: string | string[],
    eventName: string | string[] | AnyFunction,
    listener?: AnyFunction
  ): this {
    const { windowNames, eventNames, callback } = this._normalizeArg(
      windowName,
      eventName,
      listener
    );

    this._handle(windowNames, eventNames, callback);

    return this;
  }

  protected _handle(
    windowNames: string[],
    eventNames: string[],
    listener: AnyFunction,
    once = false
  ): this {
    this._each(windowNames, eventNames, (windowName, eventName) => {
      const resEventName = this._getEventName(windowName, eventName);

      if (once) {
        this.responsiveEventMap.set(resEventName, (...args: any[]) => {
          listener(...args);
          this.removeHandler(windowName, eventName);
        });
      } else {
        this.responsiveEventMap.set(resEventName, listener);
      }
    });

    return this;
  }

  handleOnce(eventName: string | string[], listener: AnyFunction): this;
  handleOnce(
    windowName: string | string[],
    eventName: string | string[],
    listener: AnyFunction
  ): this;
  handleOnce(
    windowName: string | string[],
    eventName: string | string[] | AnyFunction,
    listener?: AnyFunction
  ): this {
    const { windowNames, eventNames, callback } = this._normalizeArg(
      windowName,
      eventName,
      listener
    );

    this._handle(windowNames, eventNames, callback, true);

    return this;
  }

  removeHandler(eventName: string | string[]): this;
  removeHandler(
    windowName: string | string[],
    eventName: string | string[]
  ): this;
  removeHandler(
    windowName: string | string[],
    eventName?: string | string[]
  ): this {
    const { windowNames, eventNames } = this._normalizeArg(
      windowName,
      eventName
    );

    this._removeHandler(windowNames, eventNames);

    return this;
  }

  protected _removeHandler(windowNames: string[], eventNames: string[]): this {
    this._each(windowNames, eventNames, (windowName, eventName) => {
      const resEventName = this._getEventName(windowName, eventName);

      this.responsiveEventMap.delete(resEventName);
    });

    return this;
  }
}
