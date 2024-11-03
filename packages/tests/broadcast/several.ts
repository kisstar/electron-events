import { CHANNEL } from '@demo/utils';
import { expect, test } from '@playwright/test';
import { TestContext } from '../test';
import {
  getAppPage,
  getAppWindowID,
  getBrambleWindowID,
  getBriarWindowID,
  getTitleOnChanged
} from '../utils';

export async function testRendererSendToSeveral(testCtx: TestContext) {
  test('send events to multiple windows', async () => {
    const page = await getAppPage(testCtx);
    const brambleWindowID = await getBrambleWindowID(testCtx);
    const briarWindowID = await getBriarWindowID(testCtx);
    const brambleTitlePromise = getTitleOnChanged(brambleWindowID, testCtx);
    const briarWindowIDTitlePromise = getTitleOnChanged(briarWindowID, testCtx);
    await page.click('#renderer-send-to-several');
    const titles = await Promise.all([
      brambleTitlePromise,
      briarWindowIDTitlePromise
    ]);

    expect(
      titles.every(title => CHANNEL.RENDERER_SEND_ONE_TO_SEVERAL === title)
    ).toBeTruthy();
  });
}

export async function testRendererSendToAll(testCtx: TestContext) {
  test('send events to all windows', async () => {
    const page = await getAppPage(testCtx);
    const appWindowID = await getAppWindowID(testCtx);
    const brambleWindowID = await getBrambleWindowID(testCtx);
    const briarWindowID = await getBriarWindowID(testCtx);
    const appTitlePromise = getTitleOnChanged(appWindowID, testCtx);
    const brambleTitlePromise = getTitleOnChanged(brambleWindowID, testCtx);
    const briarWindowIDTitlePromise = getTitleOnChanged(briarWindowID, testCtx);
    await page.click('#renderer-send-to-all');
    const titles = await Promise.all([
      appTitlePromise,
      brambleTitlePromise,
      briarWindowIDTitlePromise
    ]);

    expect(
      titles.every(title => CHANNEL.RENDERER_SEND_ONE_TO_ALL === title)
    ).toBeTruthy();
  });
}
