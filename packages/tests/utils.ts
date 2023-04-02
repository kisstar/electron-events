import { type Page } from 'playwright';
import { resolve as stlResolve } from 'path';
import { WindowName } from '@demo/main/event';
import { WINDOW_NAME } from '@demo/utils';
import { TestContext } from './test';

export const resolve = (...paths: string[]) =>
  stlResolve(__dirname, '../..', ...paths);

export const sleep = async (time = 1000) =>
  new Promise(res => {
    setTimeout(res, time);
  });

interface GetPageOptions {
  justWait?: boolean;
  isWindow?: boolean;
}

const getWindowID = async (windowName: WindowName, testCtx: TestContext) => {
  const { electronApp } = testCtx;
  const windowID = await electronApp.evaluate(
    ({ BrowserWindow }, { windowName }) => {
      const window = BrowserWindow.getAllWindows().find(
        window => windowName === window.getTitle()
      );

      return window?.id;
    },
    {
      windowName
    }
  );

  return windowID;
};

export const getPage = async (
  windowName: WindowName,
  testCtx: TestContext,
  options: GetPageOptions = {}
): Promise<Page | number> => {
  const { justWait, isWindow } = options;
  const { electronApp, pageMap, windowIDMap } = testCtx;

  if (isWindow) {
    const targetWindowID = windowIDMap[windowName];

    if (targetWindowID) {
      return targetWindowID;
    }
  }

  const targetPage = pageMap[windowName];

  if (targetPage) {
    return targetPage;
  }

  const page = await electronApp.firstWindow();
  let newPage: Page | null = null;

  if (windowName === WINDOW_NAME.APP) {
    newPage = page;
  } else {
    if (justWait) {
      const windows = electronApp.windows();

      for (let i = 0; i < windows.length; i++) {
        const pageItem = windows[i];

        if (windowName === (await pageItem.title())) {
          newPage = pageItem;
        }
      }

      if (!newPage) {
        return getPage(windowName, testCtx, { justWait: true });
      }
    } else {
      await page.click(`#create-${windowName}`);
      newPage = await electronApp.waitForEvent('window');
    }
  }

  const title = await newPage.title();

  // Perhaps there is an internal issue with the event triggering mechanism.
  // Sometimes the title of the window library will be "DevTools",
  // so it is necessary to continue listening for the next "window" event
  if ('DevTools' === title) {
    return getPage(windowName, testCtx, { justWait: true });
  }

  const windowID = await getWindowID(windowName, testCtx);

  if (windowID) {
    windowIDMap[windowName] = windowID;
  }

  pageMap[windowName] = newPage;

  return isWindow ? windowIDMap[windowName] : newPage;
};

export const getAppPage = async (testCtx: TestContext) => {
  const appPage = await getPage(WINDOW_NAME.APP, testCtx);

  return appPage as Page;
};

export const getBramblePage = async (testCtx: TestContext) => {
  const bramblePage = await getPage(WINDOW_NAME.BRAMBLE, testCtx);

  return bramblePage as Page;
};

export const getBriarPage = async (testCtx: TestContext) => {
  const briarlePage = await getPage(WINDOW_NAME.BRIAR, testCtx);

  return briarlePage as Page;
};

export const getAppWindowID = async (testCtx: TestContext) => {
  const appWindowID = await getPage(WINDOW_NAME.APP, testCtx, {
    isWindow: true
  });

  return appWindowID as number;
};

export const getBrambleWindowID = async (testCtx: TestContext) => {
  const brambleWindowID = await getPage(WINDOW_NAME.BRAMBLE, testCtx, {
    isWindow: true
  });

  return brambleWindowID as number;
};
