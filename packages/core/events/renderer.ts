import { ipcRenderer } from 'electron';
import { isArray } from 'lodash';
import { IpcEvents } from '../models';
import { ANY_WINDOW_SYMBOL, EVENT_CENTER } from '../utils';

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
        const resEventName = this._getEventName(fromName, evName);
        const anyEventName = this._getEventName(ANY_WINDOW_SYMBOL, evName);

        this.eventMap.emit(resEventName, ...payload);
        this.eventMap.emit(anyEventName, ...payload);
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
