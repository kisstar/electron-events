import { test, expect } from '@playwright/test';
import { CHANNEL } from '@demo/utils';
import {
  getAppWindowID,
  getBrambleWindowID,
  getAppPage,
  getTileOnChanged
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
  test('sends events to the main process', async () => {
    const page = await getAppPage(testCtx);
    const appWinodwID = await getAppWindowID(testCtx);
    const titlePromise = getTileOnChanged(appWinodwID, testCtx);
    await page.click('#renderer-send-to-main');
    const title = await titlePromise;

    expect(title).toBe(CHANNEL.RENDERER_SEND_TO_MAIN);
  });
}

export async function testRendererSendToOne(testCtx: TestContext) {
  test('send an event to another sub window', async () => {
    const page = await getAppPage(testCtx);
    const brambleWinodwID = await getBrambleWindowID(testCtx);
    const titlePromise = getTileOnChanged(brambleWinodwID, testCtx);
    await page.click('#renderer-send-to-bramble');
    const title = await titlePromise;

    expect(title).toBe(CHANNEL.RENDERER_SEND_ONE_TO_ONE);
  });
}
