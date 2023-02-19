import { BrowserWindow, ipcMain } from 'electron';
import { isArray } from 'lodash';
import { windowPool } from '../base';
import { IpcEvents } from '../models';
import { EVENT_CENTER, MAIN_EVENT } from '../utils';

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
      if (!isArray(toName)) {
        toName = [toName];
      }

      toName.forEach(winName => {
        if (MAIN_EVENT === winName) {
          if (!isArray(eventName)) {
            eventName = [eventName];
          }

          eventName.forEach(evName => {
            const resEventName = `${windowName}_${evName}`;

            this.eventMap.emit(resEventName, ...payload);
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
    if (!isArray(windowName)) {
      windowName = [windowName];
    }

    windowName.forEach(winName => {
      const toWindow = windowPool.get(winName);

      if (!toWindow) {
        return;
      }

      toWindow.webContents.send(EVENT_CENTER, {
        fromName: MAIN_EVENT,
        eventName,
        payload: args
      });
    });
  }
}
