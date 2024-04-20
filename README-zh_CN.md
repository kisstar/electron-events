# electron-events

为 Electron 提供跨进程的事件通信系统。

[English](./README.md) . 中文

## 安装

```bash
# use npm
npm install electron-events

# or use yarn
yarn add electron-events
```

## 使用

在主进程中，以窗口名称为标识将其添加到事件系统的窗口池中：

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

然后，通过预加载脚本暴露事件模块给渲染进程：

```js
// preload.js
import { contextBridge } from 'electron';
import { useEvents } from 'electron-events';

const ipcEvents = useEvents();

contextBridge.exposeInMainWorld('electronAPI', {
  ipcEvents
});
```

之后，您不必关心所处的进程，只需根据窗口的名称来传播事件：

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

正如您所看到的，事件可以在主进程或渲染器进程中发送和接收。

[查看更多](https://github.com/kisstar/electron-events/blob/main/packages/docs/zh/index.md).

## License

MIT
