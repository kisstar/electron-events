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
