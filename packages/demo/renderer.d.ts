import { type PreloadDependencies } from '@core/index';

export interface IElectronAPI {
  createWindow: (windowInfo: WindowInfo) => void;
  EVENTS_PRELOAD_DEPENDENCIES: PreloadDependencies;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
