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
    wins.main.openWin();
    wins.main.win?.focus();
    wins.login.closeWin();

    mqtt.user.fetchInfo();
    mqtt.user.fetchToken();
  },
  /**
   * 退出
   * */
  async signOut() {
    wins.main.win?.hide();
    mqtt.connect.signOut();
    wins.login.openWin();
    wins.main.closeWin();
  },
};

export default connectSrv;
