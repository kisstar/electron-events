import { bind } from 'lodash';
import { MainIpcEvents, RendererIpcEvents } from './events';
import { windowPool } from './base';

type EventMethod = keyof RendererIpcEvents;

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
    const methodList: EventMethod[] = [
      'on',
      'once',
      'emit',
      'emitTo',
      'off',
      'invoke',
      'invokeTo'
    ];

    rendererEvents = new RendererIpcEvents();
    methodList.forEach(
      methodName =>
        (rendererEvents![methodName] = bind(
          rendererEvents![methodName],
          rendererEvents
        ))
    );
  }

  return rendererEvents;
};
