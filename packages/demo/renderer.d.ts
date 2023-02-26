import { type RendererIpcEvents } from '@core/events';

export interface IElectronAPI {
  createWindow: (windowInfo: WindowInfo) => void;
  events: RendererIpcEvents;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
