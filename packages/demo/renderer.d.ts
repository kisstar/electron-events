export interface IElectronAPI {
  createWindow: (windowInfo: WindowInfo) => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
