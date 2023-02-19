import { release } from 'os';
import { join } from 'path';
import { app, BrowserWindow } from 'electron';
import './event';

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
const preload = join(__dirname, './preload.js');

async function createWindow() {
  win = new BrowserWindow({
    title: 'Electron Events',
    webPreferences: {
      preload
    }
  });

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
