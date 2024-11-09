import { useEvents as useMainEvents, type MainIpcEvents } from './main';
import { PRELOAD_DEPENDENCIES } from './preload';
import {
  useEvents as useRendererEvents,
  type RendererIpcEvents
} from './renderer';

export { useWindowPool, type MainIpcEvents } from './main';

export * from './preload';

export { type RendererIpcEvents } from './renderer';

export function useEvents(type: 'browser'): MainIpcEvents;
export function useEvents(
  type?: Exclude<typeof process.type, 'browser'>
): RendererIpcEvents;
export function useEvents(type = process.type) {
  if ('browser' === type) {
    return useMainEvents();
  }

  return useRendererEvents(PRELOAD_DEPENDENCIES);
}

export * from './common';

export default useEvents;
