import { test, expect } from '@playwright/test';
import { CHANNEL } from '@demo/utils';
import { getAppPage } from '../utils';
import { TestContext } from '../test';

export async function testRendererInvokeToSelf(testCtx: TestContext) {
  test('invoke events to self in render process', async () => {
    const page = await getAppPage(testCtx);
    await page.click('#renderer-invoke-to-app');
    const title = await page.title();

    expect(title).toBe(CHANNEL.RENDERER_INVOKE_TO_SELF);
  });
}
