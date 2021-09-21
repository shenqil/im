import { BrowserWindow, ipcMain } from 'electron';
import { createBrowserWindow } from '../utils/win'

const WIN_NAME = 'login_window'

let window: BrowserWindow;
const createWindow = (): void => {
  if (window) {
    return;
  }
  window = createBrowserWindow({}, WIN_NAME)
};

export default {
  createWindow
}
