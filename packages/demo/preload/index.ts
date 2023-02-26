import { contextBridge } from 'electron';
import { useEvents } from '@core/index';

const events = useEvents();

contextBridge.exposeInMainWorld('electronAPI', {
  events
});
