import { ipcRenderer } from 'electron';
import { isArray, isFunction } from 'lodash';
import { IpcEvents } from '../models';
import {
  ANY_WINDOW_SYMBOL,
  ErrorCode,
  EventType,
  EVENT_CENTER
} from '../utils';

interface RendererEventCenterParams {
  type?: EventType;
  handlerName?: string;
  fromName: string;
  eventName: string | string[];
  payload: any[];
}

export class RendererIpcEvents extends IpcEvents {
  constructor() {
    super();

    ipcRenderer.on(EVENT_CENTER, (_, params: RendererEventCenterParams) => {
      let {
        type = EventType.NORMAL,
        fromName,
        eventName,
        payload,
        handlerName
      } = params;

      if (!isArray(eventName)) {
        eventName = [eventName];
      }

      if (EventType.NORMAL === type) {
        eventName.forEach(evName => {
          const resEventName = this._getEventName(fromName, evName);
          const anyEventName = this._getEventName(ANY_WINDOW_SYMBOL, evName);

          this.eventMap.emit(resEventName, ...payload);
          this.eventMap.emit(anyEventName, ...payload);
        });
        return;
      }

      if (!handlerName) {
        return;
      }

      const resArr = eventName.map(async evName => {
        const resEventName = this._getEventName(fromName, evName);
        const anyEventName = this._getEventName(ANY_WINDOW_SYMBOL, evName);
        const handler =
          this.responsiveEventMap.get(resEventName) ||
          this.responsiveEventMap.get(anyEventName);

        if (!isFunction(handler)) {
          return Promise.reject({
            code: ErrorCode.NOT_FOUNT,
            message: `Error occurred in handler for '${evName}': No handler registered for '${evName}'`
          });
        }

        try {
          return await handler(...payload);
        } catch (error) {
          return {
            code: ErrorCode.EXECUTION_EXCEPTION,
            message: new Error(
              `Error occurred in handler for '${evName}': Execution exception'`
            ),
            payload: error
          };
        }
      });

      Promise.all(resArr)
        .then(res => {
          ipcRenderer.invoke(handlerName!, {
            code: ErrorCode.SUCCESS,
            message: '',
            payload: res
          });
        })
        .catch(error => {
          ipcRenderer.invoke(handlerName!, error);
        });
    });
  }

  emitTo(
    windowName: string | string[],
    eventName: string | string[],
    ...args: any[]
  ) {
    ipcRenderer.invoke(EVENT_CENTER, {
      toName: windowName,
      eventName,
      payload: args
    });
  }

  invokeTo(
    windowName: string | string[],
    eventName: string | string[],
    ...args: any[]
  ) {
    return ipcRenderer.invoke(EVENT_CENTER, {
      type: EventType.RESPONSIVE,
      toName: windowName,
      eventName,
      payload: args
    });
  }
}
