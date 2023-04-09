# electron-events

Provide single point and broadcast event system for Electron.

## Install

```bash
# use npm
npm install electron-events

# or use yarn
yarn add electron-events
```

## Usage

Add the window module to the event system in the main process:

```js
import { useEvents } from 'electron-events';

const events = useEvents('browser');
const mainWindow = new BrowserWindow();

events.addWindow(
  /* The name here will be used later to specify the target or recipient of the event triggered. */
  'app',
  mainWindow
);
```

Now you don't have to care about the process, just communicate events based on the name of the window:

```js
// Renderer
import { useEvents } from 'electron-events';

const events = useEvents();

events.on('app', 'say_hi', text => {
  console.log(text);
});

// Main
import { useEvents } from 'electron-events';

const events = useEvents();

events.emitTo('app', 'say_hi', 'Hello World!');
```

As you can see, event can be sent and received in either the main process or the renderer process.

## License

MIT
