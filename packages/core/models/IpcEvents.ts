import { EventEmitter } from 'events';
import { isArray, isFunction, noop } from 'lodash';

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
    eventName: string | string[] | AnyFunction,
    listener?: AnyFunction
  ): NormalizeOnArg {
    if (isFunction(eventName)) {
      listener = eventName;
      eventName = windowName;
      windowName = '';
    }
    if (!isArray(windowName)) {
      windowName = windowName ? [windowName] : [];
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
    for (let i = 0; i < windowNames.length; i++) {
      for (let j = 0; j < eventNames.length; j++) {
        const resEventName = `${windowNames[i] ? windowNames[i] + '_' : ''}${
          eventNames[j]
        }`;

        if (once) {
          this.eventMap.once(resEventName, listener);
        } else {
          this.eventMap.on(resEventName, listener);
        }
      }
    }

    return this;
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

    eventName.forEach(name => this.eventMap.emit(name, ...args));
  }

  off(
    windowName: string | string[],
    eventName: string | string[],
    listener: AnyFunction
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
    for (let i = 0; i < windowNames.length; i++) {
      for (let j = 0; j < eventNames.length; j++) {
        const resEventName = `${windowNames[i] ? windowNames[i] + '_' : ''}${
          eventNames[j]
        }`;

        this.eventMap.off(resEventName, listener);
      }
    }

    return this;
  }
}
