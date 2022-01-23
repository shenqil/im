/* eslint-disable class-methods-use-this */
import { IMessage, EMsgType } from '@main/interface/msg';
import mqtt from '@main/modules/mqtt';
import type { IUserInfo } from '@main/modules/mqtt/interface';

export interface IMsgSrv {
  sendMsg(msg:IMessage):Promise<unknown>,
  onReciveNewMsg(msg:IMessage):void
}

class MsgSrv implements IMsgSrv {
  userInfo:IUserInfo | undefined;

  constructor() {
    this.init(undefined);
  }

  async init(userInfo:IUserInfo | undefined) {
    this.userInfo = userInfo;
    mqtt.msg.onReciveNewMsg(this.onReciveNewMsg.bind(this));
  }

  clear() {
    this.userInfo = undefined;
  }

  async sendMsg(msg:IMessage) {
    if (!this.userInfo) {
      throw new Error('用户未登录,禁止发送消息');
    }

    switch (msg.msgType) {
      case EMsgType.text:
      {
        await mqtt.msg.send(msg);
        break;
      }

      default:
        console.error(`未知消息类型:${msg}`);
        break;
    }
  }

  onReciveNewMsg(msg:IMessage) {
    console.log(msg, 'onReciveNewMsg');
  }
}

export default new MsgSrv();
