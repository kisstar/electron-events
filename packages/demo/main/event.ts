import { ipcMain, BrowserWindow } from 'electron';
import { CREATE_WINDOW } from '../utils';

export interface WindowInfo {
  name: string;
  url: string;
}

ipcMain.handle(CREATE_WINDOW, (_, windowInfo: WindowInfo) => {
  const { name, url } = windowInfo;
  const win = new BrowserWindow({
    title: name
  });

  win.loadURL(url);
  win.webContents.openDevTools();
});
