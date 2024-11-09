import { contextBridge, ipcRenderer } from 'electron';
import { PRELOAD_DEPENDENCIES as EVENTS_PRELOAD_DEPENDENCIES } from '@core/preload';
import { TestChannelType, TEST_CHANNEL } from '@demo/utils';
import { WindowInfo } from '@demo/main/event';

contextBridge.exposeInMainWorld('electronAPI', {
  EVENTS_PRELOAD_DEPENDENCIES,
  createWindow(windowInfo: WindowInfo) {
    return ipcRenderer.invoke(TEST_CHANNEL, {
      type: TestChannelType.CREATE_WINDOW,
      windowInfo
    });
  }
});
