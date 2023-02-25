import { MainIpcEvents, RendererIpcEvents } from './events';
import { windowPool } from './base';

let mainEvents: MainIpcEvents | null = null;
let rendererEvents: RendererIpcEvents | null = null;

export const useWindowPool = () => windowPool;

export const useEvents = () => {
  if ('browser' === process.type) {
    if (!mainEvents) {
      mainEvents = new MainIpcEvents();
    }

    return mainEvents;
  }

  if (!rendererEvents) {
    rendererEvents = new RendererIpcEvents();
  }

  return rendererEvents;
};
