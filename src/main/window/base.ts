import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { joinDirname } from '../utils/common'

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


/**
 * 定义基础窗口接口
 * */
export interface IBaseWIN {
  win: BrowserWindow | null
  openWin(options: BrowserWindowConstructorOptions | void): void
}

/**
 * 定义一个基础窗口
 * */
class BaseWIN implements IBaseWIN {
  win: BrowserWindow | null // 窗口实体
  WIN_NAME: string // 窗口名称

  constructor(name: string) {
    this.win = null
    this.WIN_NAME = name
  }

  /**
   * 打开窗口
   * */
  openWin(options: BrowserWindowConstructorOptions | void) {
    if (this.win) {
      return
    }

    this.win = createBrowserWindow(options || {}, this.WIN_NAME)
  }
}

export default BaseWIN
