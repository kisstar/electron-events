import { isArray, isFunction } from 'lodash';
import { IpcEvents, type IpcEventIdentifier, IpcEventArgs } from '../models';
import { ANY_WINDOW_SYMBOL, ErrorCode, EventType } from '../utils';
import type { PreloadDependencies } from '../dependencies';

interface RendererIpcEventsOptions {
  preloadDependencies: PreloadDependencies;
}

interface RendererEventCenterParams {
  type?: EventType;
  handlerName?: string;
  fromName: string;
  eventName: string | string[];
  payload: any[];
}

export class RendererIpcEvents extends IpcEvents {
  private static instance: RendererIpcEvents | null = null;

  private constructor(public options: RendererIpcEventsOptions) {
    super();

    this.options.preloadDependencies.on(
      (_, params: RendererEventCenterParams) => {
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
              )
            };
          }
        });

        // 负责等待所有事件执行完成，然后返回结果通过主进程通知给发起的窗口
        Promise.all(resArr)
          .then(res => {
            this.options.preloadDependencies.invoke({
              type: EventType.RESPONSIVE_RESPONSE,
              handlerName,
              code: ErrorCode.SUCCESS,
              message: '',
              payload: res
            });
          })
          .catch(error => {
            this.options.preloadDependencies.invoke({
              type: EventType.RESPONSIVE_RESPONSE,
              handlerName,
              code: error.code,
              message: error.message
            });
          });
      }
    );
  }

  static getInstance(options: RendererIpcEventsOptions): RendererIpcEvents {
    if (!this.instance) {
      this.instance = new RendererIpcEvents(options);
    }

    return this.instance;
  }

  emitTo<K extends IpcEventIdentifier = IpcEventIdentifier>(
    windowName: string | string[],
    eventName: K,
    ...args: IpcEventArgs<K>
  ) {
    this.options.preloadDependencies.invoke({
      toName: windowName,
      eventName,
      payload: args
    });
  }

  invokeTo<K extends IpcEventIdentifier = IpcEventIdentifier>(
    windowName: string | string[],
    eventName: K,
    ...args: IpcEventArgs<K>
  ) {
    return this.options.preloadDependencies.invoke({
      type: EventType.RESPONSIVE,
      toName: windowName,
      eventName,
      payload: args
    });
  }
}
