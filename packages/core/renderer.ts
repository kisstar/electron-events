import { RendererIpcEvents } from './events/renderer';
import { type PreloadDependencies } from './dependencies';

export type { RendererIpcEvents };

export function useRendererEvents(preloadDependencies: PreloadDependencies) {
  return RendererIpcEvents.getInstance({ preloadDependencies });
}

// common export
export type { EventKey } from './models';

export type { PreloadDependencies } from './dependencies';

export { ErrorCode, ANY_WINDOW_SYMBOL } from './utils';
