import { CHANNEL } from '@demo/utils';
import { expect, test } from '@playwright/test';
import { TestContext } from '../test';
import { getAppPage, getAppWindowID, getTileOnChanged } from '../utils';

export async function testRendererInvokeToSeveral(testCtx: TestContext) {
  test('invoke events to multiple windows', async () => {
    const page = await getAppPage(testCtx);
    const appWinodwID = await getAppWindowID(testCtx);
    const titlePromise = getTileOnChanged(appWinodwID, testCtx);
    await page.click('#renderer-invoke-to-several');
    const title = await titlePromise;

    expect(title.toString()).toBe(
      [
        [CHANNEL.RENDERER_INVOKE_ONE_TO_SEVERAL],
        [CHANNEL.RENDERER_INVOKE_ONE_TO_SEVERAL]
      ].toString()
    );
  });
}

export async function testRendererInvokeToAll(testCtx: TestContext) {
  test('invoke events to all windows', async () => {
    const page = await getAppPage(testCtx);
    const appWinodwID = await getAppWindowID(testCtx);
    const titlePromise = getTileOnChanged(appWinodwID, testCtx);
    await page.click('#renderer-invoke-to-all');
    const title = await titlePromise;

    expect(title.toString()).toBe(
      [
        [CHANNEL.RENDERER_INVOKE_ONE_TO_ALL],
        [CHANNEL.RENDERER_INVOKE_ONE_TO_ALL],
        [CHANNEL.RENDERER_INVOKE_ONE_TO_ALL]
      ].toString()
    );
  });
}
