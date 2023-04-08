import { join } from 'path';
import { BrowserWindow, ipcMain } from 'electron';
import { useEvents, useWindowPool } from '@core/index';
import { windowPool } from '@core/base';
import {
  WINDOW_NAME,
  CHANNEL,
  getDebug,
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
  rendererInvokeId:
    | 'renderer-invoke-to-app'
    | 'renderer-invoke-to-bramble'
    | 'renderer-invoke-to-briar';
  url: string;
  status: 'normal' | 'lock';
}

export type TestChannel = 'own' | 'someone' | 'several' | 'all';

export interface TestChannelInfo {
  type: TestChannel;
}

type TestChannelPayload =
  | {
      type: TestChannelType.CREATE_WINDOW;
      windowInfo: WindowInfo;
    }
  | {
      type: TestChannelType.TEST_HANDLE;
      channelInfo: TestChannelInfo;
    };

export const preload = join(__dirname, './preload.js');
const debug = getDebug('Main');
const events = useEvents();
const setTitle = (title: string) => `document.title = ${title}`;

function testHandler(params: TestChannelInfo) {
  const { type } = params;

  switch (type) {
    default:
      debug('*', 'No matching operation.');
  }
}

ipcMain.handle(TEST_CHANNEL, (_, payload: TestChannelPayload) => {
  const { type } = payload;
  const windowPool = useWindowPool();

  switch (type) {
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
    case TestChannelType.TEST_HANDLE:
      return testHandler(payload.channelInfo);
    default:
      return;
  }
});

events.on(WINDOW_NAME.APP, CHANNEL.RENDERER_SEND_TO_MAIN, () => {
  const win = windowPool.get(WINDOW_NAME.APP);

  win?.webContents.executeJavaScript(setTitle(CHANNEL.RENDERER_SEND_TO_MAIN));
  debug(
    WINDOW_NAME.APP,
    `Received a message from ${WINDOW_NAME.APP} on channel ${CHANNEL.RENDERER_SEND_TO_MAIN}.`
  );
});

events.on(WINDOW_NAME.APP, CHANNEL.RENDERER_SEND_ONE_TO_ALL, () => {
  const win = windowPool.get(WINDOW_NAME.APP);

  win?.webContents.executeJavaScript(
    setTitle(CHANNEL.RENDERER_SEND_ONE_TO_ALL)
  );
  debug(
    WINDOW_NAME.APP,
    `Received a message from ${WINDOW_NAME.APP} on channel ${CHANNEL.RENDERER_SEND_ONE_TO_ALL}.`
  );
});
