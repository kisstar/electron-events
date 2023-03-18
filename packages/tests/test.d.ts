import { type ElectronApplication } from 'playwright';

export interface TestContext {
  electronApp: ElectronApplication;
}
