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
import { useEvents } from 'electron-events';

const events = useEvents('browser');
const mainWindow = new BrowserWindow();

events.addWindow(
  /* The name here will be used later to specify the target or recipient of the event triggered. */
  'app',
  mainWindow
);
```

Then, expose events module via preload:

```js
// preload.js
import { contextBridge } from 'electron';
import { useEvents } from 'electron-events';

const ipcEvents = useEvents();

contextBridge.exposeInMainWorld('electronAPI', {
  ipcEvents
});
```

Now you don't have to care about the process, just communicate events based on the name of the window:

```js
// renderer.js
const useEvents = () => window.electronAPI.ipcEvents;
const events = useEvents();

events.on('main' /* Name of the main process */, 'say_hi', text => {
  console.log(text);
});

// main.js
import { useEvents } from 'electron-events';

const events = useEvents();

events.emitTo('app', 'say_hi', 'Hello World!');
```

As you can see, event can be sent and received in either the main process or the renderer process.

[See more](https://github.com/kisstar/electron-events/blob/main/packages/docs/index.md).

## License

MIT
