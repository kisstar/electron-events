# Broadcast mode

It supports publishing and subscribing custom events across processes without caring about the processing results of listeners.

## on()

Listen to the `eventName` event on the `windowName` window. When a new message arrives, the corresponding callback will be called in the form of `listener (args...)`.

Type declaration:

```ts
interface on {
  (
    windowName: string | string[],
    eventName: string | string[],
    listener: AnyFunction
  ): this;
  (eventName: string | string[], listener: AnyFunction): this;
}
```

Parameter description:

- **windowName** Optional, window name
- **eventName** Event name
- **listener** Callback function

If no window is specified, it defaults to the current window.

## once()

Similar to the function of the `on()` method, the difference is that the added callback function is one-time and will be automatically removed after the event is triggered.

Type declaration:

```ts
interface once {
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
- **listener** Callback function

If no window is specified, it defaults to the current window.

## emit()

Trigger the `eventName` event in the current window.

Type declaration:

```ts
interface emit {
  (eventName: string | string[], ...args: any[]): void;
}
```

Parameter description:

- **eventName** Event name
- **args** Parameter list

Although you can manually splice event names to trigger callback functions of other windows, it is best not to do so.

## emitTo()

Carry the specified parameter list and send a message to the `eventName` event in the `windowName` window.

Type declaration:

```ts
interface emitTo {
  (
    windowName: string | string[],
    eventName: string | string[],
    ...args: any[]
  ): void;
}
```

Parameter description:

- **windowName** Window name
- **eventName** Event name
- **args** Parameter list

When sending information through this method, the window name is required.

## off()

Removes the event listener for the specified window.

Type declaration:

```ts
interface off {
  (eventName: string | string[]): this;
  (windowName: string | string[], eventName: string | string[]): this;
  (eventName: string | string[], listener: AnyFunction): this;
}
```

Parameter description:

- **windowName** Optional, window name
- **eventName** Event name
- **listener** Optional, callback function

If no callback function corresponding to the event is specified, all listeners associated with it will be removed.
