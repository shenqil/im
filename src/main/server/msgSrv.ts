/* eslint-disable class-methods-use-this */
import {
  IMessage,
} from '@main/interface/msg';
import mqtt from '@main/modules/mqtt';
import type { IUserInfo } from '@main/modules/mqtt/interface';

export interface IMsgSrv {
  sendMsg(msg:IMessage):Promise<unknown>,
  onReciveNewMsg(msg:IMessage):void
}

class MsgSrv implements IMsgSrv {
  userInfo:IUserInfo | undefined;

  constructor() {
    this.userInfo = undefined;
    mqtt.singleMsg.onReciveNewMsg(this.onReciveNewMsg.bind(this));
  }

  async init(userInfo:IUserInfo) {
    this.userInfo = userInfo;
    mqtt.singleMsg.onReciveNewMsg(this.onReciveNewMsg.bind(this));
  }

  clear() {
    this.userInfo = undefined;
  }

  async sendMsg(msg:IMessage) {
    if (!this.userInfo) {
      throw new Error('用户未登录,禁止发送消息');
    }

    console.log(msg);
  }

  onReciveNewMsg(msg:IMessage) {
    console.log(msg, 'onReciveNewMsg');
  }
}

export default new MsgSrv();
