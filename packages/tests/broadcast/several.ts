import { CHANNEL } from '@demo/utils';
import { expect, test } from '@playwright/test';
import { TestContext } from '../test';
import {
  getAppPage,
  getBrambleWindowID,
  getBriarWindowID,
  getTileOnChanged
} from '../utils';

export async function testRendererSendToSeveral(testCtx: TestContext) {
  test('send events to multiple windows', async () => {
    const page = await getAppPage(testCtx);
    const brambleWinodwID = await getBrambleWindowID(testCtx);
    const briarWinodwID = await getBriarWindowID(testCtx);
    const brambleTitlePromise = getTileOnChanged(brambleWinodwID, testCtx);
    const briarWinodwIDTitlePromise = getTileOnChanged(briarWinodwID, testCtx);
    await page.click('#renderer-send-to-several');
    const titles = await Promise.all([
      brambleTitlePromise,
      briarWinodwIDTitlePromise
    ]);

    expect(
      titles.every(title => CHANNEL.RENDERER_SEND_ONE_TO_SEVERAL === title)
    ).toBeTruthy();
  });
}
