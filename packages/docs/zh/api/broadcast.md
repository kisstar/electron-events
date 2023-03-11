# 广播模式

支持跨进程的发布和订阅自定义事件，而不必关心监听者的处理结果。

## on()

监听 `windowName` 窗口上的 `eventName` 事件，当新消息到达时，将通过 `listener(args...)` 的形式调用对应的回调。

类型声明：

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

参数说明：

- windowName 可选的，窗口名称
- eventName 事件名称
- listener 回调函数

当省略窗口时，默认为当前窗口。

## once()

和 `on()` 方法的功能类似，不同的是添加的回调函数是一次性的，这个回调函数会在事件触发后自动移除。

类型声明：

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

参数说明：

- windowName 可选的，窗口名称
- eventName 事件名称
- listener 回调函数

当省略窗口时，默认为当前窗口。

## emit()

触发当前窗口中的 `eventName` 事件。

类型声明：

```ts
interface emit {
  (eventName: string | string[], ...args: any[]): void;
}
```

参数说明：

- eventName 事件名称
- args 参数列表

虽然可以手动拼接事件命名来触发其它窗口的回调函数，但最好不要这样做。

## emitTo()

携带指定的参数列表，向 `windowName` 窗口的 `eventName` 事件发送消息。

类型声明：

```ts
interface emitTo {
  (
    windowName: string | string[],
    eventName: string | string[],
    ...args: any[]
  ): void;
}
```

参数说明：

- windowName 窗口名称
- eventName 事件名称
- args 参数列表

通过该方法发送信息时，窗口名称是必需的。

## off()

移除指定窗口的事件监听器。

类型声明：

```ts
interface off {
  (eventName: string | string[]): this;
  (windowName: string | string[], eventName: string | string[]): this;
  (eventName: string | string[], listener: AnyFunction): this;
}
```

参数说明：

- windowName 可选的，窗口名称
- eventName 事件名称
- listener 可选的，回调函数

如果没有指定事件对应的回调函数，将会移除与其相关的所有监听器。
