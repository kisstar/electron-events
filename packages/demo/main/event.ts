import { join } from 'path';
import { BrowserWindow } from 'electron';
import { useEvents, useWindowPool } from '@core/index';
import { CREATE_WINDOW, SAY_HI } from '../utils';

export const preload = join(__dirname, './preload.js');

export interface WindowInfo {
  name: string;
  url: string;
  status: 'normal' | 'lock';
}

const events = useEvents();

events.on('App', CREATE_WINDOW, (windowInfo: WindowInfo) => {
  const windowPool = useWindowPool();
  const { name, url } = windowInfo;
  const win = new BrowserWindow({
    title: name,
    webPreferences: {
      preload
    }
  });

  win.loadURL(url);
  win.webContents.openDevTools();
  windowPool.add(name, win);
});

events.on('App', SAY_HI, () => {
  console.log('Received a message from app on channel sayHi.');
});
