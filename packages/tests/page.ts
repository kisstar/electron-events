import { test, expect } from '@playwright/test';
import { WINDOW_NAME } from '@demo/utils';
import { TestContext } from './test';
import { getAppPage, getBramblePage, getBriarPage } from './utils';

export async function testFirstPage(testCtx: TestContext) {
  test('renders the first page', async () => {
    const { windowIDMap } = testCtx;

    expect(windowIDMap[WINDOW_NAME.APP]).toBeFalsy();

    const page = await getAppPage(testCtx);
    const title = await page.title();

    expect(windowIDMap[WINDOW_NAME.APP]).toBeTruthy();
    expect(title).toBe(WINDOW_NAME.APP);
  });
}

export async function testCreateBrambleWindow(testCtx: TestContext) {
  test('click the button to open Bramble window', async () => {
    const { windowIDMap } = testCtx;

    expect(windowIDMap[WINDOW_NAME.BRAMBLE]).toBeFalsy();

    const page = await getBramblePage(testCtx);
    const title = await page.title();

    expect(windowIDMap[WINDOW_NAME.BRAMBLE]).toBeTruthy();
    expect(title).toBe(WINDOW_NAME.BRAMBLE);
  });
}

export async function testCreateBriarWindow(testCtx: TestContext) {
  test('click the button to open Briar window', async () => {
    const { windowIDMap } = testCtx;

    expect(windowIDMap[WINDOW_NAME.BRIAR]).toBeFalsy();

    const page = await getBriarPage(testCtx);
    const title = await page.title();

    expect(windowIDMap[WINDOW_NAME.BRIAR]).toBeTruthy();
    expect(title).toBe(WINDOW_NAME.BRIAR);
  });
}
