import { test, expect } from '@playwright/test';
import { CHANNEL } from '@demo/utils';
import {
  getAppWindowID,
  getBrambleWindowID,
  getAppPage,
  getTitleOnChanged,
  sleep
} from '../utils';
import { TestContext } from '../test';

export async function testRendererSendToSelf(testCtx: TestContext) {
  test('send events to self in render process', async () => {
    const page = await getAppPage(testCtx);
    await page.click('#renderer-send-to-app');
    const title = await page.title();

    expect(title).toBe(CHANNEL.RENDERER_SEND_TO_SELF);
  });
}

export async function testRendererSendToMain(testCtx: TestContext) {
  test('send events to the main process', async () => {
    const page = await getAppPage(testCtx);
    const appWindowID = await getAppWindowID(testCtx);
    const titlePromise = getTitleOnChanged(appWindowID, testCtx);
    await page.click('#renderer-send-to-main');
    const title = await titlePromise;

    expect(title).toBe(CHANNEL.RENDERER_SEND_TO_MAIN);
  });
}

export async function testRendererSendToOne(testCtx: TestContext) {
  test('send an event to another sub window', async () => {
    const page = await getAppPage(testCtx);
    const brambleWindowID = await getBrambleWindowID(testCtx);
    const titlePromise = getTitleOnChanged(brambleWindowID, testCtx);
    await page.click('#renderer-send-to-bramble');
    const title = await titlePromise;

    expect(title).toBe(CHANNEL.RENDERER_SEND_ONE_TO_ONE);
  });
}

export async function testCancelRendererSendToOne(testCtx: TestContext) {
  test('cancel send an event to another sub window', async () => {
    const page = await getAppPage(testCtx);
    const brambleWindowID = await getBrambleWindowID(testCtx);
    let titlePromise = getTitleOnChanged(brambleWindowID, testCtx);
    await page.click('#renderer-send-one-to-one-once');
    let title = await titlePromise;
    getTitleOnChanged(brambleWindowID, testCtx).then(t => (title = t));
    await page.click('#renderer-send-one-to-one-once');
    await sleep(100); // title should not change, so we just wait for a while

    expect(title).toBe(CHANNEL.RENDERER_SEND_ONE_TO_ONE_ONCE);
  });
}
