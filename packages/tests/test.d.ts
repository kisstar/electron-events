import { type ElectronApplication, type Page, type Electron } from 'playwright';
import { type WindowName } from '@demo/main/event';

export interface TestContext {
  electronApp: ElectronApplication;
  pageMap: {
    [name in WindowName]: Page;
  };
  windowIDMap: {
    [name in WindowName]: number;
  }
}
