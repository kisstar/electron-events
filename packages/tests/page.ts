import { test, expect } from '@playwright/test';
import { TestContext } from './test';

export async function testFirstPage(testCtx: TestContext) {
  test('renders the first page', async () => {
    const { electronApp } = testCtx;
    const page = await electronApp.firstWindow();
    const title = await page.title();

    expect(title).toBe('Electron Events');
  });
}
