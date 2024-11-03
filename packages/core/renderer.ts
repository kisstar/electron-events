import { RendererIpcEvents } from './events/renderer';
import { type PreloadDependencies } from './dependencies';

export type { RendererIpcEvents };

export function useEvents(preloadDependencies: PreloadDependencies) {
  return RendererIpcEvents.getInstance({ preloadDependencies });
}

export * from './common';

export default useEvents;
