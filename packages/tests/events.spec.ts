import { _electron as electron } from 'playwright';
import { test } from '@playwright/test';
import { resolve } from './utils';
import {
  testFirstPage,
  testCreateBrambleWindow,
  testCreateBriarWindow
} from './page';
import {
  testRendererSendToSelf,
  testRendererSendToMain,
  testRendererSendToOne,
  testRendererSendToSeveral,
  testRendererSendToAll
} from './broadcast';
import {
  testRendererInvokeToSelf,
  testRendererInvokeToMain,
  testRendererInvokeToOne,
  testRendererInvokeToSeveral,
  testRendererInvokeToAll
} from './responsive';
import { TestContext } from './test';

const testCtx = {
  pageMap: {},
  windowIDMap: {}
} as TestContext;

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
  testCreateBrambleWindow(testCtx);
  testCreateBriarWindow(testCtx);
  testRendererSendToSelf(testCtx);
  testRendererSendToMain(testCtx);
  testRendererSendToOne(testCtx);
  testRendererSendToSeveral(testCtx);
  testRendererSendToAll(testCtx);
  // responsive mode
  testRendererInvokeToSelf(testCtx);
  testRendererInvokeToMain(testCtx);
  testRendererInvokeToOne(testCtx);
  testRendererInvokeToSeveral(testCtx);
  testRendererInvokeToAll(testCtx);
};

main();
