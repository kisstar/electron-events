import { _electron as electron, type ElectronApplication } from 'playwright';
import { test } from '@playwright/test';
import { resolve } from './utils';

let electronApp: ElectronApplication;

test.beforeAll(async () => {
  electronApp = await electron.launch({
    args: [resolve('dist-electron/index.js')]
  });
  electronApp.on('window', async page => {
    const filename = page
      .url()
      ?.split('/')
      .pop();

    console.log(`Window opened: ${filename}`);
    // capture errors
    page.on('pageerror', error => {
      console.error(error);
    });
    // capture console messages
    page.on('console', msg => {
      console.log(msg.text());
    });
  });
});

test.afterAll(async () => {
  await electronApp.close();
});
