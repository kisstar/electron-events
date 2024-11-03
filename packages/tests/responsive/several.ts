import { CHANNEL } from '@demo/utils';
import { expect, test } from '@playwright/test';
import { TestContext } from '../test';
import { getAppPage, getAppWindowID, getTitleOnChanged } from '../utils';

export async function testRendererInvokeToSeveral(testCtx: TestContext) {
  test('invoke events to multiple windows', async () => {
    const page = await getAppPage(testCtx);
    const appWindowID = await getAppWindowID(testCtx);
    const titlePromise = getTitleOnChanged(appWindowID, testCtx);
    await page.click('#renderer-invoke-to-several');
    const title = await titlePromise;

    expect(title).toBe(
      JSON.stringify([
        CHANNEL.RENDERER_INVOKE_ONE_TO_SEVERAL,
        CHANNEL.RENDERER_INVOKE_ONE_TO_SEVERAL
      ])
    );
  });
}

export async function testRendererInvokeToAll(testCtx: TestContext) {
  test('invoke events to all windows', async () => {
    const page = await getAppPage(testCtx);
    const appWindowID = await getAppWindowID(testCtx);
    const titlePromise = getTitleOnChanged(appWindowID, testCtx);
    await page.click('#renderer-invoke-to-all');
    const title = await titlePromise;

    expect(title).toBe(
      JSON.stringify([
        CHANNEL.RENDERER_INVOKE_ONE_TO_ALL,
        CHANNEL.RENDERER_INVOKE_ONE_TO_ALL,
        CHANNEL.RENDERER_INVOKE_ONE_TO_ALL,
        CHANNEL.RENDERER_INVOKE_ONE_TO_ALL
      ])
    );
  });
}
