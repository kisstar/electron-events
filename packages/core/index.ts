import { bind } from 'lodash';
import { MainIpcEvents, RendererIpcEvents } from './events';

let mainEvents: MainIpcEvents | null = null;
let rendererEvents: RendererIpcEvents | null = null;
type EventMethod = keyof RendererIpcEvents;

export type { MainIpcEvents, RendererIpcEvents };

export type { EventKey } from './models';

export { useWindowPool } from './base';

export function useEvents(type: 'browser'): MainIpcEvents;
export function useEvents(
  type?: Exclude<typeof process.type, 'browser'>
): RendererIpcEvents;
export function useEvents(type = process.type) {
  if ('browser' === type) {
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
}
