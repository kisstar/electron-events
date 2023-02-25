import { ipcRenderer } from 'electron';
import { isArray } from 'lodash';
import { IpcEvents } from '../models';
import { EVENT_CENTER } from '../utils';

interface RendererEventCenterParams {
  fromName: string;
  eventName: string | string[];
  payload: any[];
}

export class RendererIpcEvents extends IpcEvents {
  constructor() {
    super();

    ipcRenderer.on(EVENT_CENTER, (_, params: RendererEventCenterParams) => {
      let { fromName, eventName, payload } = params;

      if (!isArray(eventName)) {
        eventName = [eventName];
      }

      eventName.forEach(evName => {
        const resEventName = `${fromName}_${evName}`;

        this.eventMap.emit(resEventName, ...payload);
      });
    });
  }

  emitTo(
    windowName: string | string[],
    eventName: string | string[],
    ...args: any[]
  ) {
    ipcRenderer.invoke(EVENT_CENTER, {
      toName: windowName,
      eventName,
      payload: args
    });
  }
}
