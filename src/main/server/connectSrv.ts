/* eslint-disable class-methods-use-this */
import { EMainEventKey } from '@main/ipcMain/eventInterface';
import { beforeLogin, afterLogin, afterSignOut } from '@main/lifeCycle';
import ipcEvent from '@main/ipcMain/event';
import mqtt from '../modules/mqtt/index';
import wins from '../window/index';

export interface IConnectSrv {
  login(username:string, password:string):Promise<unknown>
  signOut():Promise<unknown>
  mainMenuReady():Promise<unknown>
  loginMenuReady():Promise<unknown>
}

class ConnectSrv implements IConnectSrv {
  private isMainMenuReady:boolean;

  private whenMainMenuList:Array<any>;

  constructor() {
    this.isMainMenuReady = false;
    this.whenMainMenuList = [];
  }

  private whenMainMenuReady() {
    return new Promise((resolve) => {
      if (this.isMainMenuReady) {
        resolve('');
      } else {
        this.whenMainMenuList.push(resolve);
      }
    });
  }

  async mainMenuReady() {
    if (wins.main.win) {
      this.isMainMenuReady = true;
      for (const resolve of this.whenMainMenuList) {
        resolve();
      }
      this.whenMainMenuList = [];
    }
  }

  async loginMenuReady() {
    if (wins.login.win) {
      beforeLogin();
      // 登录界面加载完成后，开始隐藏加载主界面
      wins.main.openWin({ show: false });
    }
  }

  /**
   * 登录
   * */
  async login(username:string, password:string) {
    await mqtt.connect.login(username, password);
    await this.whenMainMenuReady();
    wins.login.win?.hide();
    ipcEvent.emit(EMainEventKey.RouteChange, 'msg');
    wins.main.win?.show();
    wins.main.win?.focus();
    await afterLogin();
  }

  /**
   * 退出
   * */
  async signOut() {
    wins.main.win?.hide();
    await mqtt.connect.signOut();
    this.isMainMenuReady = false;
    wins.main.win?.reload();
    wins.login.win?.show();
    wins.login.win?.focus();
    await afterSignOut();
  }
}

export default new ConnectSrv();
