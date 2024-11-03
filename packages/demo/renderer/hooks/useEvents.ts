import { useEvents as useRendererEvents } from '@core/renderer';

export const useEvents = () =>
  useRendererEvents(window.electronAPI.EVENTS_PRELOAD_DEPENDENCIES);
