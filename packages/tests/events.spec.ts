import { _electron as electron } from 'playwright';
import { test } from '@playwright/test';
import { resolve } from './utils';
import { testFirstPage } from './page';
import { testRendererSendToSelf } from './broadcast';
import { TestContext } from './test';

const testCtx = {} as TestContext;

test.beforeAll(async () => {
  const electronApp = await electron.launch({
    args: [resolve('dist-electron/index.js')]
  });

  testCtx.electronApp = electronApp;
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
  // exit app
  await testCtx.electronApp.close();
});

const main = async () => {
  // test cases
  testFirstPage(testCtx);
  testRendererSendToSelf(testCtx);
};

main();
