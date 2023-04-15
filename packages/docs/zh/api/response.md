# 响应模式

支持跨进程的发布和订阅自定义事件，并等待对应频道的监听者的处理结果。

## handle()

为 `eventName` 事件添加一个 `listener` 处理器。 在当前进程调用 `invoke(channel, ...args)` 时这个处理器就会被调用。

如果处理器返回一个 Promise，那么 Promise 的最终结果就是远程调用的返回值。否则，监听器的返回值将被用来作为应答值。

类型声明：

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

参数说明：

- windowName 可选的，窗口名称
- eventName 事件名称
- listener 处理器函数

当省略窗口时，默认为当前窗口。

## handleOnce()

和 `handle()` 方法的功能类似，不同的是添加的处理器函数是一次性的，这个处理器函数会在事件触发后自动移除。

类型声明：

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

参数说明：

- windowName 可选的，窗口名称
- eventName 事件名称
- listener 处理器函数

当省略窗口时，默认为当前窗口。

## invoke()

通过 `eventName` 事件发送消息，并异步等待结果。

类型声明：

```ts
interface invoke {
  <T = any>(eventName: string | string[], ...args: any[]): Promise<T | T[]>;
}
```

参数说明：

- eventName 事件名称
- args 参数列表

当同时发送多个事件时，返回值将会是一个数组。

虽然可以手动拼接事件命名来触发其它窗口的回调函数，但最好不要这样做。

## invokeTo()

携带指定的参数列表，向 `windowName` 窗口的 `eventName` 事件发送消息。

类型声明：

```ts
interface invokeTo {
  <T = any>(
    windowName: string | string[],
    eventName: string | string[],
    ...args: any[]
  ): Promise<T | T[] | T[][]>;
}
```

参数说明：

- windowName 窗口名称
- eventName 事件名称
- args 参数列表

此时返回值将会有四种情况：

- 当 `windowName` 和 `eventName` 都为字符串时，返回值为对应的唯一事件处理器的返回值。
- 当 `windowName` 为字符串 `eventName` 为数组时，返回值为一维数组，数组中的每一项对应这个窗口中针对每个事件的处理结果。
- 当 `windowName` 为数组 `eventName` 为字符串时，返回值为一维数组，数组中的每一项对应每个窗口针对该事件的处理结果。
- 最后，当两者都为数组时，返回值将会是一个二维数组，一维数组中的每一项对应了每个窗口，而二维数组中的每一项则对应了每个窗口中每个事件处理器的返回值。

通过该方法发送信息时，窗口名称不可以省略。

## removeHandler()

移除 `windowName`窗口针对 `eventName` 的所有处理程序。

类型声明：

```ts
interface removeHandler {
  (eventName: string | string[]): this;
  (windowName: string | string[], eventName: string | string[]): this;
}
```

参数说明：

- windowName 可选的，窗口名称
- eventName 事件名称
