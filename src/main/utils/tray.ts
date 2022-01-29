import {
  Tray, Menu, nativeTheme, app,
} from 'electron';
import ipcEvent from '@main/ipcMain/event';
import EMainEventKey from '@main/ipcMain/eventInterface';
import wins from '@main/window/index';
import { joinDirname } from './common';

let isLogin = false;

function isVisible() {
  if (isLogin) {
    return wins.main.win?.isVisible();
  }

  return wins.login.win?.isVisible();
}

/**
 * 窗口显示
 * */
function winShow() {
  if (isLogin) {
    wins.main.win?.show();
    wins.main.win?.restore();
    wins.main.win?.focus();
  } else {
    wins.login.win?.show();
    wins.main.win?.restore();
    wins.main.win?.focus();
  }
}

/**
 * 窗口隐藏
 * */
function winHide() {
  if (isLogin) {
    wins.main.win?.hide();
  } else {
    wins.login.win?.hide();
  }
}

// ================托盘 ===================
class TrayClass {
  private tray: Tray;

  private trayTimeHande!: NodeJS.Timeout;

  private trayImgNone: boolean;

  private isTwinkling: boolean;

  private trayImg: string;

  constructor() {
    this.trayImgNone = false; // 图标状态
    this.isTwinkling = false;
    this.trayImg = 'logo.png';

    if (process.platform === 'darwin') {
      if (nativeTheme.shouldUseDarkColors) {
        this.trayImg = 'logo.png';
      } else {
        this.trayImg = 'logo.png';
      }
    }

    this.tray = new Tray(joinDirname(`./static/img/${this.trayImg}`));
    const contextMenu = Menu.buildFromTemplate([{
      label: '退出',
      type: 'normal',
      click: () => {
        ipcEvent.emit(EMainEventKey.appQuit, true);
        app.exit();
      },
    },
    ]);

    this.tray.setToolTip('eChat');
    this.tray.setContextMenu(contextMenu);

    this.tray.on('click', () => {
      if (isVisible()) {
        if (!this.isTwinkling) {
          winHide();
        } else {
          winShow();
        }
      } else {
        winShow();
      }

      this.taryRemindOff();
    });
  }

  /**
   * 拼接托盘图标
   * */
  setImage(name:string | undefined) {
    if (this.tray) {
      this.tray.setImage(joinDirname(`./static/img/${name || this.trayImg}`));
    }
  }

  /**
   * 暗黑模式发生变化
   * */
  themeChanged() {
    if (nativeTheme.shouldUseDarkColors) {
      this.setImage(undefined);
    } else {
      this.setImage(undefined);
    }
  }

  /**
   * 开启托盘闪烁
   * */
  taryRemindOn() {
    this.isTwinkling = true;
    clearInterval(this.trayTimeHande);
    if (process.platform !== 'win32') {
      return; // mac 不用闪烁
    }
    this.trayTimeHande = setInterval(() => {
      if (!this.tray) {
        // 不存在,清空定时器,并退出
        clearInterval(this.trayTimeHande);
        return;
      }
      this.trayImgNone = !this.trayImgNone;
      if (!this.trayImgNone) {
        this.setImage(undefined);
      } else if (process.platform === 'win32') {
        this.setImage('none.ico'); // 变为透明
      }
    }, 500);
  }

  /**
   * 关闭托盘闪烁
   * */
  taryRemindOff() {
    this.isTwinkling = false;
    clearInterval(this.trayTimeHande);
  }
}

const tray = new TrayClass();

/**
 * 监听登录事件
 * */
ipcEvent.on(EMainEventKey.loginStatus, (status:boolean) => {
  isLogin = status;
});

export default tray;
