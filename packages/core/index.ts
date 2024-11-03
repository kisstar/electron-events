import {
  useEvents as useMainEvents,
  PRELOAD_DEPENDENCIES,
  type MainIpcEvents
} from './main';
import {
  useEvents as useRendererEvents,
  type RendererIpcEvents
} from './renderer';

export {
  PRELOAD_DEPENDENCIES,
  useWindowPool,
  type MainIpcEvents
} from './main';

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
