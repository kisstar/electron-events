# TypeScript

## Label specific event types

Use the internally provided `EventKey` interface to annotate specific event types, limiting the data provided and the parameters of the corresponding event handler when triggering the event.

In the following example, we restrict the say_hi event to require a string type of data when triggered, and when processing the say_hi event, we can only provide a function that accepts a string parameter:

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

If you do not need to provide any parameters, you can directly use `EventKey`, and if you need to provide multiple parameters, you can use the `EventKey<[string, number]>` method to qualify them.
