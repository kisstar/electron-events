import { MainIpcEvents } from './events';

export type { MainIpcEvents };

export { PRELOAD_DEPENDENCIES } from './dependencies';

export { useWindowPool } from './base';

export function useMainEvents() {
  return MainIpcEvents.getInstance();
}

// common export
export type { EventKey } from './models';

export { type PreloadDependencies } from './dependencies';

export { ErrorCode, ANY_WINDOW_SYMBOL } from './utils';
