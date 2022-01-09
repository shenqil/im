/* eslint-disable class-methods-use-this */
import { beforeLogin, afterLogin } from '@main/lifeCycle';
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

      afterLogin();
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
    wins.main.win?.show();
    wins.main.win?.focus();
    afterLogin();
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
  }
}

export default new ConnectSrv();
