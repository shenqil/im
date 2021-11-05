import mqtt from '../modules/mqtt/index';
import { IUserInfo, IToken } from '../modules/mqtt/interface';

export interface IUserSrv {
  getUserInfo():Promise<IUserInfo>
  getToken():Promise<IToken>
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
}

export default new UserSrv();
