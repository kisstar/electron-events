import { test, expect } from '@playwright/test';
import { CHANNEL } from '@demo/utils';
import { getAppPage, getAppWindowID, getTitleOnChanged, sleep } from '../utils';
import { TestContext } from '../test';

export async function testRendererInvokeToSelf(testCtx: TestContext) {
  test('invoke events to self in render process', async () => {
    const page = await getAppPage(testCtx);
    await page.click('#renderer-invoke-to-app');
    const title = await page.title();

    expect(title).toBe(CHANNEL.RENDERER_INVOKE_TO_SELF);
  });
}

export async function testRendererInvokeToMain(testCtx: TestContext) {
  test('invoke events to the main process', async () => {
    const page = await getAppPage(testCtx);
    const appWindowID = await getAppWindowID(testCtx);
    const titlePromise = getTitleOnChanged(appWindowID, testCtx);
    await page.click('#renderer-invoke-to-main');
    const title = await titlePromise;

    expect(title).toBe(CHANNEL.RENDERER_INVOKE_TO_MAIN);
  });
}

export async function testRendererInvokeToOne(testCtx: TestContext) {
  test('invoke an event to another sub window', async () => {
    const page = await getAppPage(testCtx);
    const appWindowID = await getAppWindowID(testCtx);
    const titlePromise = getTitleOnChanged(appWindowID, testCtx);
    await page.click('#renderer-invoke-to-bramble');
    const title = await titlePromise;

    expect(title).toBe(CHANNEL.RENDERER_INVOKE_ONE_TO_ONE);
  });
}

export async function testCancelRendererInvokeToOne(testCtx: TestContext) {
  test('cancel invoke an event to another sub window', async () => {
    const page = await getAppPage(testCtx);
    const appWindowID = await getAppWindowID(testCtx);
    let titlePromise = getTitleOnChanged(appWindowID, testCtx);
    await page.click('#renderer-invoke-one-to-one-once');
    let title = await titlePromise;
    getTitleOnChanged(appWindowID, testCtx).then(t => (title = t));
    await page.click('#renderer-invoke-one-to-one-once');
    await sleep(100); // title should not change, so we just wait for a while

    expect(title).toBe(CHANNEL.RENDERER_INVOKE_ONE_TO_ONE_ONCE);
  });
}
