import { mainEvents, rendererEvents, windowPool } from './base';

export const useWindowPool = () => windowPool;

export const useEvents = () => {
  if ('browser' === process.type) {
    return mainEvents;
  }

  return rendererEvents;
};
