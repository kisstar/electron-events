import { bind } from 'lodash';
import { MainIpcEvents, RendererIpcEvents } from './events';

type EventMethod = keyof RendererIpcEvents;

let mainEvents: MainIpcEvents | null = null;
let rendererEvents: RendererIpcEvents | null = null;

export { useWindowPool } from './base';

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
      'handle',
      'handleOnce',
      'invoke',
      'invokeTo',
      'removeHandler'
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
