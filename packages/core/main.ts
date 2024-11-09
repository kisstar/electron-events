import { MainIpcEvents } from './events';

export type { MainIpcEvents };

export { useWindowPool } from './base';

export function useEvents() {
  return MainIpcEvents.getInstance();
}

export * from './common';

export default useEvents;
