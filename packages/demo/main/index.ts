import { release } from 'os';
import { app, BrowserWindow } from 'electron';
import { useWindowPool } from '@core/index';
import { preload } from './event';

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;

async function createWindow() {
  const windowPool = useWindowPool();

  win = new BrowserWindow({
    title: 'Electron Events',
    webPreferences: {
      preload
    }
  });
  windowPool.add('App', win);
  win.loadURL(process.env.VITE_DEV_SERVER_URL);
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  win = null;

  if (process.platform !== 'darwin') app.quit();
});

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();

    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();

  allWindows.length ? allWindows[0].focus() : createWindow();
});
