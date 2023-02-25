import { BrowserWindow, ipcMain } from 'electron';
import { isArray } from 'lodash';
import { windowPool } from '../base';
import { IpcEvents } from '../models';
import { ANY_WINDOW_SYMBOL, EVENT_CENTER, MAIN_EVENT_NAME } from '../utils';

interface MainEventCenterParams {
  toName: string | string[];
  eventName: string | string[];
  payload: any[];
}

export class MainIpcEvents extends IpcEvents {
  constructor() {
    super();

    ipcMain.handle(EVENT_CENTER, (event, params: MainEventCenterParams) => {
      const window = BrowserWindow.fromWebContents(event.sender);

      if (!window) {
        return;
      }

      const windowName = windowPool.getName(window.id);
      let { toName, eventName, payload } = params;

      if (!windowName) {
        return;
      }
      if (ANY_WINDOW_SYMBOL === toName) {
        toName = windowPool.getAllNames();
        toName.unshift(MAIN_EVENT_NAME);
      }
      if (!isArray(toName)) {
        toName = [toName];
      }

      toName.forEach(winName => {
        if (MAIN_EVENT_NAME === winName) {
          if (!isArray(eventName)) {
            eventName = [eventName];
          }

          eventName.forEach(evName => {
            const resEventName = this._getEventName(windowName, evName);
            const anyEventName = this._getEventName(ANY_WINDOW_SYMBOL, evName);

            this.eventMap.emit(resEventName, ...payload);
            this.eventMap.emit(anyEventName, ...payload);
          });
          return;
        }

        const toWindow = windowPool.get(winName);

        if (!toWindow) {
          return;
        }

        toWindow.webContents.send(EVENT_CENTER, {
          fromName: windowName,
          eventName,
          payload
        });
      });
    });
  }

  emitTo(
    windowName: string | string[],
    eventName: string | string[],
    ...args: any[]
  ) {
    if (ANY_WINDOW_SYMBOL === windowName) {
      windowName = windowPool.getAllNames();
    }
    if (!isArray(windowName)) {
      windowName = [windowName];
    }

    windowName.forEach(winName => {
      const toWindow = windowPool.get(winName);

      if (!toWindow) {
        return;
      }

      toWindow.webContents.send(EVENT_CENTER, {
        fromName: MAIN_EVENT_NAME,
        eventName,
        payload: args
      });
    });
  }
}
