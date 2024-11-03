# electron-events

Provide a cross process event communication system for Electron.

English . [中文](./README-zh_CN.md)

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
// main.js
import { useEvents } from 'electron-events/main';

const events = useEvents();
const mainWindow = new BrowserWindow();

events.addWindow(
  /* The name here will be used later to specify the target or recipient of the event triggered. */
  'app',
  mainWindow
);
```

Then, pass the dependencies to the rendering process through preload script:

```js
// preload.js
import { contextBridge } from 'electron';
import { PRELOAD_DEPENDENCIES as EVENTS_PRELOAD_DEPENDENCIES } from 'electron-events/main';

contextBridge.exposeInMainWorld('electronAPI', {
  EVENTS_PRELOAD_DEPENDENCIES
});
```

Now you don't have to care about the process, just communicate events based on the name of the window:

```js
// renderer.js
import { useEvents as useRendererEvents } from 'electron-events/renderer';

const useEvents = () =>
  useRendererEvents(window.electronAPI.EVENTS_PRELOAD_DEPENDENCIES); // Remember to inject dependencies
const events = useEvents();

events.on('main' /* Name of the main process */, 'say_hi', text => {
  console.log(text);
});

// main.js
import { useEvents } from 'electron-events/main';

const events = useEvents();

events.emitTo('app', 'say_hi', 'Hello World!');
```

As you can see, event can be sent and received in either the main process or the renderer process.

[See more](https://github.com/kisstar/electron-events/blob/main/packages/docs/index.md).

## License

MIT
