import { BrowserWindow, ipcMain } from 'electron';
import { isArray, isFunction, isString } from 'lodash';
import { windowPool } from '../base';
import { IpcEvents, type IpcEventIdentifier, IpcEventArgs } from '../models';
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

interface HandlerParams {
  type: EventType.RESPONSIVE_RESPONSE;
  handlerName: string;
  code: number;
  message: string;
  payload?: any[];
}

interface MainEventCenterParams {
  type?: EventType;
  toName: string | string[];
  eventName: string | string[];
  payload: any[];
  timeout?: number; // The waiting time specified by the initiator when processing responsive APIs
}

interface ResponseArray {
  isSingleToName?: boolean;
  isSingleEventName?: boolean;
  resArr: (never[] | Promise<unknown>)[];
}

export class MainIpcEvents extends IpcEvents {
  private static instance: MainIpcEvents | null = null;
  private handlers: Map<
    string,
    {
      resolve: (...args: any[]) => void;
      reject: (...args: any[]) => void;
      timer?: NodeJS.Timeout;
    }
  > = new Map();
  private constructor() {
    super();

    ipcMain.handle(
      EVENT_CENTER,
      (event, params: MainEventCenterParams | HandlerParams) => {
        const { type = EventType.NORMAL } = params;

        if (EventType.RESPONSIVE_RESPONSE === type) {
          this.handleResponsiveResponse(params as HandlerParams);
          return;
        }

        const mainEventCenterParams = params as MainEventCenterParams;
        let { toName, eventName } = mainEventCenterParams;

        const window = BrowserWindow.fromWebContents(event.sender);

        if (!window) {
          return;
        }

        const windowName = windowPool.getName(window.id);

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
          return this._handleNormalEvent(
            windowName,
            toName,
            mainEventCenterParams
          );
        } else {
          return this._handleResponsiveEvent(
            windowName,
            toName,
            mainEventCenterParams,
            {
              isSingleToName,
              isSingleEventName
            }
          );
        }
      }
    );
  }

  static getInstance(): MainIpcEvents {
    if (!this.instance) {
      this.instance = new MainIpcEvents();
    }

    return this.instance;
  }

  addWindow(name: string, bw: BrowserWindow) {
    return windowPool.add(name, bw);
  }

  removeWindow(idOrName: string | number) {
    return windowPool.remove(idOrName);
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

  /**
   * 向指定窗口发送事件，并生成处理器标识符，存储事件响应的处理函数
   *
   * @param fromName 当前窗口名称
   * @param toName 目标窗口名称
   * @param params 事件中心参数，包含事件名称、事件负载和超时时间
   * @returns 返回 Promise 对象，在事件触发时解析，或在超时时拒绝
   */
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
    const eventPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.handlers.delete(handlerName);
        reject({
          code: ErrorCode.OVERTIME,
          message: new Error(
            `Listen to the response of window ${toName} timeout`
          )
        });
      }, timeout);

      this.handlers.set(handlerName, {
        resolve,
        reject,
        timer
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
      return result.then(([innerRes]) => innerRes[0]);
    } else if (isSingleToName) {
      return result.then(([innerRes]) => innerRes);
    } else if (isSingleEventName) {
      return result.then(res => res.map(innerRes => innerRes[0]));
    } else {
      return result;
    }
  }

  /**
   * 处理响应式通信的消息响应
   *
   * @param params 参数对象
   * @param params.code 响应码
   * @param params.message 响应消息
   * @param params.payload 数据载荷
   * @param params.handlerName 完成响应的处理器名称
   */
  handleResponsiveResponse(params: HandlerParams) {
    const { code, message, payload: data, handlerName } = params;
    const handler = this.handlers.get(handlerName);

    if (!handler) {
      return;
    }

    const { resolve, reject, timer: tid } = handler;

    clearTimeout(tid);
    this.handlers.delete(handlerName);

    if (code === ErrorCode.SUCCESS) {
      resolve(data);
    } else {
      reject(message);
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
