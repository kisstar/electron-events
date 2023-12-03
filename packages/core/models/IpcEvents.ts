import { EventEmitter } from 'events';
import {
  isArray,
  isEmpty,
  isFunction,
  isString,
  isUndefined,
  noop
} from 'lodash';
import { ANY_WINDOW_SYMBOL, SELF_NAME, ErrorCode } from '@core/utils';

export interface EventStringKey<_T extends Array<any>> extends String {}

export interface EventArrayKey<_T extends Array<any>> extends Array<string> {}

export type EventKey<T extends Array<any>> =
  | EventStringKey<T>
  | EventArrayKey<T>;

export type IpcEventIdentifier<T extends Array<any> = []> =
  | EventKey<T>
  | string
  | string[];

export type IpcEventArgs<T> = T extends EventKey<infer V> ? V : any;

export type IpcEventHandler<T> = T extends EventKey<infer V>
  ? EventHandler<V>
  : EventHandler;

interface NormalizeOnArg {
  windowNames: string[];
  eventNames: string[];
  callback: AnyFunction;
}

export class IpcEvents {
  protected eventMap = new EventEmitter();
  protected responsiveEventStore: {
    [key: string]: AnyFunction;
  } = Object.create(null);
  protected responsiveEventMap = {
    set: (name: string, listener: AnyFunction) => {
      this.responsiveEventStore[name] = listener;
    },
    get: (name: string): AnyFunction | undefined => {
      return this.responsiveEventStore[name];
    },
    delete: (name: string) => {
      delete this.responsiveEventStore[name];
    }
  };

  on<K extends IpcEventIdentifier = IpcEventIdentifier>(
    eventName: K,
    listener: IpcEventHandler<K>
  ): this;
  on<K extends IpcEventIdentifier = IpcEventIdentifier>(
    windowName: string | string[],
    eventName: K,
    listener: IpcEventHandler<K>
  ): this;
  on(
    windowName: string | string[],
    eventName: IpcEventIdentifier | AnyFunction,
    listener?: AnyFunction
  ): this {
    const { windowNames, eventNames, callback } = this._normalizeArg(
      windowName,
      eventName,
      listener
    );

    this._on(windowNames, eventNames, callback);

    return this;
  }

  protected _normalizeArg(
    windowName: string | string[],
    eventName?: IpcEventIdentifier | AnyFunction,
    listener?: AnyFunction
  ): NormalizeOnArg {
    if (isFunction(eventName)) {
      listener = eventName;
      eventName = windowName;
      windowName = '';
    }
    if (isUndefined(eventName)) {
      eventName = windowName;
      windowName = '';
    }
    if (!isArray(windowName)) {
      windowName = [windowName];
    }
    if (isString(eventName)) {
      eventName = [eventName];
    }

    return {
      windowNames: windowName,
      eventNames: [...eventName],
      callback: listener || noop
    };
  }

  protected _on(
    windowNames: string[],
    eventNames: string[],
    listener: AnyFunction,
    once = false
  ): this {
    this._each(windowNames, eventNames, (windowName, eventName) => {
      const resEventName = this._getEventName(windowName, eventName);

      if (once) {
        this.eventMap.once(resEventName, listener);
      } else {
        this.eventMap.on(resEventName, listener);
      }
    });

    return this;
  }

  protected _each(
    windowNames: string[],
    eventNames: string[],
    cb: (windowName: string, eventName: string) => void
  ) {
    if (isEmpty(windowNames)) {
      windowNames = [''];
    }

    for (let i = 0; i < windowNames.length; i++) {
      for (let j = 0; j < eventNames.length; j++) {
        cb(windowNames[i], eventNames[j]);
      }
    }
  }

  protected _getEventName(windowName: string, eventName: string) {
    const hasWinName = windowName && windowName !== SELF_NAME;

    return `${hasWinName ? windowName + '_' : ''}${eventName}`;
  }

  once<K extends IpcEventIdentifier = IpcEventIdentifier>(
    eventName: K,
    listener: IpcEventHandler<K>
  ): this;
  once<K extends IpcEventIdentifier = IpcEventIdentifier>(
    windowName: string | string[],
    eventName: K,
    listener: IpcEventHandler<K>
  ): this;
  once(
    windowName: string | string[],
    eventName: IpcEventIdentifier | AnyFunction,
    listener?: AnyFunction
  ): this {
    const { windowNames, eventNames, callback } = this._normalizeArg(
      windowName,
      eventName,
      listener
    );

    this._on(windowNames, eventNames, callback, true);

    return this;
  }

  /**
   * Trigger the event listening in the current process.
   * @param {IpcEventIdentifier} eventName Event name.
   * @param {any[]} args Additional parameters.
   */
  emit<K extends IpcEventIdentifier = IpcEventIdentifier>(
    eventName: K,
    ...args: IpcEventArgs<K>
  ): void;
  emit(eventName: IpcEventIdentifier, ...args: any[]) {
    const eventNames: string[] = [];

    if (isString(eventName)) {
      eventNames.push(eventName);
    } else {
      eventNames.push(...eventName);
    }

    eventNames.forEach(name => {
      this.eventMap.emit(name, ...args);
    });
  }

  off<K extends IpcEventIdentifier = IpcEventIdentifier>(
    eventName: K,
    listener?: IpcEventHandler<K>
  ): this;
  off<K extends IpcEventIdentifier = IpcEventIdentifier>(
    windowName: string | string[],
    eventName: K,
    listener?: IpcEventHandler<K>
  ): this;
  off(
    windowName: string | string[],
    eventName?: IpcEventIdentifier | AnyFunction,
    listener?: AnyFunction
  ): this {
    const { windowNames, eventNames, callback } = this._normalizeArg(
      windowName,
      eventName,
      listener
    );

    this._off(windowNames, eventNames, callback);

    return this;
  }

  protected _off(
    windowNames: string[],
    eventNames: string[],
    listener: AnyFunction
  ): this {
    this._each(windowNames, eventNames, (windowName, eventName) => {
      const resEventName = this._getEventName(windowName, eventName);

      this.eventMap.off(resEventName, listener);
    });

    return this;
  }

  handle<K extends IpcEventIdentifier = IpcEventIdentifier>(
    eventName: K,
    listener: IpcEventHandler<K>
  ): this;
  handle<K extends IpcEventIdentifier = IpcEventIdentifier>(
    windowName: string | string[],
    eventName: K,
    listener: IpcEventHandler<K>
  ): this;
  handle(
    windowName: string | string[],
    eventName: IpcEventIdentifier | AnyFunction,
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
      const anyEventName = this._getEventName(ANY_WINDOW_SYMBOL, eventName);
      const handler = this.responsiveEventMap.get(resEventName);
      const anyHandler = this.responsiveEventMap.get(anyEventName);

      if (handler && anyHandler) {
        throw new Error(
          `Error occurred in handler for '${eventName}': Attempted to register a second handler for '${eventName}'`
        );
      }

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

  handleOnce<K extends IpcEventIdentifier = IpcEventIdentifier>(
    eventName: K,
    listener: IpcEventHandler<K>
  ): this;
  handleOnce<K extends IpcEventIdentifier = IpcEventIdentifier>(
    windowName: string | string[],
    eventName: K,
    listener: IpcEventHandler<K>
  ): this;
  handleOnce(
    windowName: string | string[],
    eventName: IpcEventIdentifier | AnyFunction,
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

  async invoke<K extends IpcEventIdentifier = IpcEventIdentifier>(
    eventName: K,
    ...args: IpcEventArgs<K>
  ) {
    // We will process the parameters received from the user in the form of an array
    // and determine the return value based on the actual number of parameters.
    const isMultipleEvents = isArray(eventName);
    const eventNames: string[] = [];

    if (isString(eventName)) {
      eventNames.push(eventName);
    } else if (isArray(eventName)) {
      eventNames.push(...eventName);
    }

    const resArr = eventNames.map(async evName => {
      const handler = this.responsiveEventMap.get(evName);

      if (!isFunction(handler)) {
        return Promise.reject({
          code: ErrorCode.NOT_FOUNT,
          message: new Error(
            `Error occurred in handler for '${evName}': No handler registered for '${evName}'`
          )
        });
      }

      try {
        return await handler(...args);
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

    return isMultipleEvents ? Promise.all(resArr) : resArr[0];
  }

  removeHandler<K extends IpcEventIdentifier = IpcEventIdentifier>(
    eventName: K
  ): this;
  removeHandler<K extends IpcEventIdentifier = IpcEventIdentifier>(
    windowName: string | string[],
    eventName: K
  ): this;
  removeHandler(
    windowName: string | string[],
    eventName?: IpcEventIdentifier
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
