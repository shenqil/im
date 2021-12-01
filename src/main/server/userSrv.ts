/* eslint-disable class-methods-use-this */
import mqtt from '../modules/mqtt';
import { IUserInfo, IToken } from '../modules/mqtt/interface';
import SQ3 from '../modules/sqlite3';
import { ESQ3CommonKey } from '../modules/sqlite3/interface';

export interface IUserSrv {
  getUserInfo():Promise<IUserInfo>
  getToken():Promise<IToken>
  getUserLoginInfo():Promise<ILoginInfo>
  saveUserLoginInfo(params:ILoginInfo):Promise<unknown>
}

export interface ILoginInfo {
  username:string,
  password:string,
  remember:boolean,
  autoLogin:boolean
}

class UserSrv implements IUserSrv {
  private token: IToken | undefined;

  private userInfo: IUserInfo | undefined;

  async getToken(): Promise<IToken> {
    if (this.token) {
      return Object.freeze(this.token);
    }

    this.token = await mqtt.user.fetchToken();

    return Object.freeze(this.token);
  }

  async getUserInfo(): Promise<IUserInfo> {
    if (this.userInfo) {
      return Object.freeze(this.userInfo);
    }

    this.userInfo = await mqtt.user.fetchInfo();

    return Object.freeze(this.userInfo);
  }

  async getUserLoginInfo():Promise<ILoginInfo > {
    const res = await SQ3.common.getData(ESQ3CommonKey.userLoginInfo);
    if (!res) {
      return {
        username: '',
        password: '',
        remember: false,
        autoLogin: false,
      };
    }
    return JSON.parse(res) as ILoginInfo;
  }

  async saveUserLoginInfo(params:ILoginInfo) {
    const loginInfo = params;
    if (!loginInfo.remember) {
      loginInfo.username = '';
      loginInfo.password = '';
      loginInfo.autoLogin = false;
    }
    return SQ3.common.saveData(ESQ3CommonKey.userLoginInfo, JSON.stringify(loginInfo));
  }
}

export default new UserSrv();
