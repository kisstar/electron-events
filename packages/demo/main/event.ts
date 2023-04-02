import { join } from 'path';
import { BrowserWindow, ipcMain } from 'electron';
import { useEvents, useWindowPool } from '@core/index';
import { windowPool } from '@core/base';
import {
  WINDOW_NAME,
  CHANNEL,
  getDebug,
  SAY_HI,
  TEST_CHANNEL,
  TestChannelType
} from '../utils';

export type WindowName = `${WINDOW_NAME}`;

export interface WindowInfo {
  name: WindowName;
  rendererSendId:
    | 'renderer-send-to-app'
    | 'renderer-send-to-bramble'
    | 'renderer-send-to-briar';
  url: string;
  status: 'normal' | 'lock';
}

type TestChannelPayload =
  | {
      type: TestChannelType.GET_WINDOW_ID;
      name: string;
    }
  | {
      type: TestChannelType.CREATE_WINDOW;
      windowInfo: WindowInfo;
    };

export const preload = join(__dirname, './preload.js');
const debug = getDebug('Main');
const events = useEvents();
const setTitle = (title: string) => `document.title = ${title}`;

ipcMain.handle(TEST_CHANNEL, (_, payload: TestChannelPayload) => {
  const { type } = payload;
  const windowPool = useWindowPool();

  switch (type) {
    case TestChannelType.GET_WINDOW_ID: {
      const { name } = payload;
      const window = windowPool.get(name);

      return window ? window.id : -1;
    }
    case TestChannelType.CREATE_WINDOW: {
      const { windowInfo } = payload;
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
      return win.id;
    }
    default:
      return;
  }
});

export type TestChannel = 'own' | 'someone' | 'several' | 'all';

export interface TestChannelInfo {
  type: TestChannel;
}

events.on(SAY_HI, () => {
  debug('self', 'Received a message from yourself on channel sayHi.');
});

events.on('App', CHANNEL.RENDERER_SEND_TO_MAIN, () => {
  const win = windowPool.get('App');

  win?.webContents.executeJavaScript(setTitle(CHANNEL.RENDERER_SEND_TO_MAIN));
  debug(
    'App',
    `Received a message from app on channel ${CHANNEL.RENDERER_SEND_TO_MAIN}.`
  );
});

events.on(['App', 'Bramble'], SAY_HI, () => {
  debug(
    ['App', 'Bramble'].join('|'),
    'Received information on channel sayHi in the specified window list.'
  );
});

events.on('*', SAY_HI, () => {
  debug('*', 'Received a mass message on channel sayHi.');
});

events.on('*', TEST_CHANNEL, (params: TestChannelInfo) => {
  const { type } = params;

  switch (type) {
    case 'own':
      events.emit(SAY_HI);
      break;
    case 'someone':
      events.emitTo('App', SAY_HI);
      break;
    case 'several':
      events.emitTo(['App', 'Bramble'], SAY_HI);
      break;
    case 'all':
      events.emitTo('*', SAY_HI);
      break;
    default:
      debug('*', 'No matching operation.');
  }
});
