import { ipcRenderer, type IpcRendererEvent } from 'electron';
import { EVENT_CENTER } from './utils';

export const PRELOAD_DEPENDENCIES = {
  on(listener: (event: IpcRendererEvent, ...args: any[]) => void) {
    return ipcRenderer.on(EVENT_CENTER, listener);
  },
  invoke(...args: any[]) {
    return ipcRenderer.invoke(EVENT_CENTER, ...args);
  }
};

export type PreloadDependencies = typeof PRELOAD_DEPENDENCIES;
