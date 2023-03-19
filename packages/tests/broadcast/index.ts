import { test, expect } from '@playwright/test';
import { CHANNEL } from '@demo/utils';
import { TestContext } from '../test';

export async function testRendererSendToSelf(testCtx: TestContext) {
  test('send events to self in render process', async () => {
    const { electronApp } = testCtx;
    const page = await electronApp.firstWindow();
    await page.click('#renderer-send-to-app');
    const title = await page.title();

    expect(title).toBe(CHANNEL.RENDERER_SEND_TO_SELF);
  });
}

export async function testRendererSendToMain(testCtx: TestContext) {
  test('sends events to the main process', async () => {
    const { electronApp } = testCtx;
    const page = await electronApp.firstWindow();
    const titlePromise = electronApp.evaluate(({ BrowserWindow }) => {
      const window = BrowserWindow.getFocusedWindow();

      return new Promise((resolve, reject) => {
        if (!window) {
          return reject('');
        }

        window.on('page-title-updated', (_, title) => resolve(title));
      });
    });

    await page.click('#renderer-send-to-main');
    const title = await titlePromise;

    expect(title).toBe(CHANNEL.RENDERER_SEND_TO_MAIN);
  });
}
