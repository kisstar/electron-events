# TypeScript

## 为特定的事件标注类型

使用内部提供的 `EventKey` 接口来为特定的事件标注类型，以限制在触发事件时提供的数据和对应事件处理器的参数。

下面的例子中，我们限制了 say_hi 事件触发时需要提供一个字符串类型的数据，而在处理 say_hi 事件时，只能提供一个接收一个字符串参数的函数：

```ts
// Renderer
import { useEvents, type EventKey } from 'electron-events';

const events = useEvents();
const SAY_HELLO: EventKey<string> = 'say_hi'; // Limited to 1 parameter and of type string

events.on('main', SAY_HELLO, text => {
  console.log(text.then); // Property 'then' does not exist on type 'string'
});
events.on('main', SAY_HELLO, (id: number) => {
  console.log(id); // Type 'string' is not assignable to type 'number'
});
events.on('main', SAY_HELLO, (text: string) => {
  console.log(text); // ✅
});

// Main
import { useEvents, type EventKey } from 'electron-events';

const events = useEvents('browser');
const SAY_HELLO: EventKey<string> = 'say_hi'; // Limited to 1 parameter and of type string

// Main
events.emitTo('app', SAY_HELLO); // Expected 3 arguments, but got 2
events.emitTo('app', SAY_HELLO, 666); // Argument of type 'number' is not assignable to parameter of type 'string'
events.emitTo('app', SAY_HELLO, 'Hello World!'); // ✅
```

如果不需要提供任何参数，可以直接使用 `EventKey`，而如果需要提供多个参数，则可以使用 `EventKey<[string, number]>` 的方式进行限定。
