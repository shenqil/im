import { BrowserWindow } from 'electron';
import { createBrowserWindow } from '../utils/win'

export interface IBaseWIN {
  win: BrowserWindow | null
  openWin(): void
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
  openWin() {
    if (this.win) {
      return
    }

    this.win = createBrowserWindow({}, this.WIN_NAME)
  }
}

export default BaseWIN
