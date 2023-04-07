import { EventEmitter } from 'events';
import { isArray, isEmpty, isFunction, isUndefined, noop } from 'lodash';
import { ANY_WINDOW_SYMBOL, ErrorCode } from '@core/utils';

interface NormalizeOnArg {
  windowNames: string[];
  eventNames: string[];
  callback: AnyFunction;
}

export class IpcEvents {
  protected eventMap = new EventEmitter();
  protected responsiveEventMap = new Map<string, AnyFunction>();

  on(eventName: string | string[], listener: AnyFunction): this;
  on(
    windowName: string | string[],
    eventName: string | string[],
    listener: AnyFunction
  ): this;
  on(
    windowName: string | string[],
    eventName: string | string[] | AnyFunction,
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
    eventName?: string | string[] | AnyFunction,
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
    if (!isArray(eventName)) {
      eventName = [eventName];
    }

    return {
      windowNames: windowName,
      eventNames: eventName,
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
    return `${windowName ? windowName + '_' : ''}${eventName}`;
  }

  once(eventName: string | string[], listener: AnyFunction): this;
  once(
    windowName: string | string[],
    eventName: string | string[],
    listener: AnyFunction
  ): this;
  once(
    windowName: string | string[],
    eventName: string | string[] | AnyFunction,
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
   * @param {string} eventName Event name.
   * @param {any[]} args Additional parameters.
   */
  emit(eventName: string | string[], ...args: any[]) {
    if (!isArray(eventName)) {
      eventName = [eventName];
    }

    eventName.forEach(name => {
      this.eventMap.emit(name, ...args);
    });
  }

  off(eventName: string | string[]): this;
  off(windowName: string | string[], eventName: string | string[]): this;
  off(eventName: string | string[], listener: AnyFunction): this;
  off(
    windowName: string | string[],
    eventName: string | string[],
    listener: AnyFunction
  ): this;
  off(
    windowName: string | string[],
    eventName?: string | string[] | AnyFunction,
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

  async invoke<T = any>(
    eventName: string | string[],
    ...args: any[]
  ): Promise<T | T[]> {
    // We will process the parameters received from the user in the form of an array
    // and determine the return value based on the actual number of parameters.
    const isMultipleEvents = isArray(eventName);

    if (!isArray(eventName)) {
      eventName = [eventName];
    }

    const resArr = eventName.map(async evName => {
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
