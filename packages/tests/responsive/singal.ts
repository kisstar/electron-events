import { test, expect } from '@playwright/test';
import { CHANNEL } from '@demo/utils';
import { getAppPage, getAppWindowID, getTitleOnChanged } from '../utils';
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
    const appWinodwID = await getAppWindowID(testCtx);
    const titlePromise = getTitleOnChanged(appWinodwID, testCtx);
    await page.click('#renderer-invoke-to-main');
    const title = await titlePromise;

    expect(title).toBe(CHANNEL.RENDERER_INVOKE_TO_MAIN);
  });
}

export async function testRendererInvokeToOne(testCtx: TestContext) {
  test('invoke an event to another sub window', async () => {
    const page = await getAppPage(testCtx);
    const appWinodwID = await getAppWindowID(testCtx);
    const titlePromise = getTitleOnChanged(appWinodwID, testCtx);
    await page.click('#renderer-invoke-to-bramble');
    const title = await titlePromise;

    expect(title).toBe(CHANNEL.RENDERER_INVOKE_ONE_TO_ONE);
  });
}
