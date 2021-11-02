import mqtt from '../modules/mqtt/index';
import wins from '../window/index';

export interface IConnectSrv {
  login(username:string, password:string):Promise<unknown>
  signOut():Promise<unknown>
}

const connectSrv:IConnectSrv = {
  /**
   * 登录
   * */
  async login(username:string, password:string) {
    await mqtt.connect.login(username, password);
    wins.login.win?.hide();
    wins.main.win?.show();
    wins.main.win?.focus();
    wins.login.win?.close();

    mqtt.user.fetchInfo();
    mqtt.user.fetchToken();
  },
  /**
   * 退出
   * */
  async signOut() {
    wins.main.win?.close();
    wins.login.openWin();
  },
};

export default connectSrv;
