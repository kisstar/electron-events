import { contextBridge, ipcRenderer } from 'electron';
import { useEvents } from '@core/index';
import { TestChannelType, TEST_CHANNEL } from '@demo/utils';
import { WindowInfo } from '@demo/main/event';

const events = useEvents();

contextBridge.exposeInMainWorld('electronAPI', {
  events,
  createWindow(windowInfo: WindowInfo) {
    return ipcRenderer.invoke(TEST_CHANNEL, {
      type: TestChannelType.CREATE_WINDOW,
      windowInfo
    });
  }
});
