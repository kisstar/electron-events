import { EventEmitter } from 'events';
import { isArray, isEmpty, isFunction, isUndefined, noop } from 'lodash';
import { ANY_WINDOW_SYMBOL } from '@core/utils';

interface NormalizeOnArg {
  windowNames: string[];
  eventNames: string[];
  callback: AnyFunction;
}

export class IpcEvents {
  protected eventMap = new EventEmitter();

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
      const resEventName = this._getEventName(ANY_WINDOW_SYMBOL, name);

      this.eventMap.emit(name, ...args);
      this.eventMap.emit(resEventName, ...args);
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
}
