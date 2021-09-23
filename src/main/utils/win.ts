import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { joinDirname } from './common'

/**
 * loadWinURL 加载界面地址
 * @param {win} 创建窗口后的实例对象
 * @param {winName} 窗口名称
 */
export function loadWinURL(win: BrowserWindow, winName: string) {
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}${winName}.html`);
    win.webContents.openDevTools()
  } else {
    win.loadURL(joinDirname(`./renderer/${winName}.html`));
    // win.webContents.openDevTools()
  }
}

/**
* createBrowserWindow 构建一个新的窗口
* @param {option} 窗口构建的选项
* @param {winName} 窗口名称
*/
export function createBrowserWindow(option: BrowserWindowConstructorOptions, winName: string) {
  const defaultOption = {
    width: 552,
    height: 384,
    maximizable: false, // 默认不能最大化
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      preload: joinDirname('./preload/preload.ts'),
    }
  }

  option.webPreferences = Object.assign(defaultOption.webPreferences, option.webPreferences)

  const newWin = new BrowserWindow(Object.assign(defaultOption, option))

  loadWinURL(newWin, winName)
  newWin.setMenu(null)

  return newWin
}
