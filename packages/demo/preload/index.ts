import { contextBridge, ipcRenderer } from 'electron';

import { WindowInfo } from '../main/event';
import { CREATE_WINDOW } from '../utils';

contextBridge.exposeInMainWorld('electronAPI', {
  createWindow: (windowInfo: WindowInfo) => {
    ipcRenderer.invoke(CREATE_WINDOW, windowInfo);
  }
});
