import { test, expect } from '@playwright/test';
import { WINDOW_AMEM } from '@demo/utils';
import { TestContext } from './test';
import { getAppPage, getBramblePage } from './utils';

export async function testFirstPage(testCtx: TestContext) {
  test('renders the first page', async () => {
    const { windowIDMap } = testCtx;

    expect(windowIDMap[WINDOW_AMEM.APP]).toBeFalsy();

    const page = await getAppPage(testCtx);
    const title = await page.title();

    expect(windowIDMap[WINDOW_AMEM.APP]).toBeTruthy();
    expect(title).toBe(WINDOW_AMEM.APP);
  });
}

export async function testCreateBrambleWindow(testCtx: TestContext) {
  test('click the button to open new window', async () => {
    const { windowIDMap } = testCtx;

    expect(windowIDMap[WINDOW_AMEM.BRAMBLE]).toBeFalsy();

    const page = await getBramblePage(testCtx);
    const title = await page.title();

    expect(windowIDMap[WINDOW_AMEM.BRAMBLE]).toBeTruthy();
    expect(title).toBe(WINDOW_AMEM.BRAMBLE);
  });
}
