# Response mode

It supports cross-process publishing and subscription of customized events, and waits for the processing results of the listeners of the corresponding channels.

## handle()

Add a `listener` processor for the `eventName` event. This processor will be called when the current process calls `invoke(channel,... args)`.

If the processor returns a promise, the final result of the promise is the return value of the remote call. Otherwise, the return value of the listener will be used as the reply value.

Type declaration:

```ts
interface handle {
  (eventName: string | string[], listener: AnyFunction): this;
  (
    windowName: string | string[],
    eventName: string | string[],
    listener: AnyFunction
  ): this;
}
```

Parameter description:

- **windowName** Optional, window name
- **eventName** Event name
- **listener** Processor functions

When a window is omitted, it defaults to the current window.

## handleOnce()

Similar to the function of the `handle()` method, the difference is that the added processor function is one-time and will be automatically removed after the event is triggered.

Type declaration:

```ts
interface handleOnce {
  (eventName: string | string[], listener: AnyFunction): this;
  (
    windowName: string | string[],
    eventName: string | string[],
    listener: AnyFunction
  ): this;
}
```

Parameter description:

- **windowName** Optional, window name
- **eventName** Event name
- **listener** Processor functions

When a window is omitted, it defaults to the current window.

## invoke()

Send a message through the `eventName` event and wait for the result asynchronously.

Type declaration:

```ts
interface invoke {
  <T = any>(eventName: string | string[], ...args: any[]): Promise<T | T[]>;
}
```

Parameter description:

- **eventName** Event name
- **args** Parameter list

When multiple events are sent at the same time, the return value will be an array.

Although you can manually splice event names to trigger callback functions of other windows, it is best not to do so.

## invokeTo()

Carry the specified parameter list and send a message to the `eventName` event in the `windowName` window.

Type declaration:

```ts
interface invokeTo {
  <T = any>(
    windowName: string | string[],
    eventName: string | string[],
    ...args: any[]
  ): Promise<T | T[] | T[][]>;
}
```

Parameter description:

- **windowName** Window name
- **eventName** Event name
- **args** Parameter list

When both `windowName` and `eventName` are strings, the return value is the return value of the processor. Otherwise, the return value will be a two-dimensional array. Each item in the one-dimensional array corresponds to the specified window, while each item in the two-dimensional array corresponds to the return value of each event handler in each window.

When sending information through this method, the window name cannot be omitted.

## removeHandler()

Remove all handlers for `eventName` in the `windowName` window.

Type declaration:

```ts
interface removeHandler {
  (eventName: string | string[]): this;
  (windowName: string | string[], eventName: string | string[]): this;
}
```

Parameter description:

- **windowName** Window name
- **eventName** Event name
