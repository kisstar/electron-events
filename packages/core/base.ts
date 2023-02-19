import { MainIpcEvents, RendererIpcEvents } from './events';
import { WindowPool } from './models';

export const windowPool = new WindowPool();

export const mainEvents = new MainIpcEvents();

export const rendererEvents = new RendererIpcEvents();
