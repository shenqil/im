/* eslint-disable class-methods-use-this */
import {
  IMessage, ECharType, EMsgType, IFilePayload,
} from '@main/interface/msg';
import mqtt from '@main/modules/mqtt';
import type { IUserInfo, IFriendInfo } from '@main/modules/mqtt/interface';
import { v4 as uuidv4 } from 'uuid';
import userSrv from './userSrv';
import friendSrv from './friendSrv';

export interface IMsgSrv {
  sendMsg(toId:string, payload:IFilePayload | string):void,
  onReciveNewMsg(msg:IMessage):void
}

class MsgSrv implements IMsgSrv {
  private msgMap:Map<string, IMessage>;

  private userId: string;

  private msgQueue:Array<IFilePayload | string>;

  constructor() {
    this.msgMap = new Map();
    this.userId = '';
    this.init();
  }

  init() {
    mqtt.singleMsg.onReciveNewMsg(this.onReciveNewMsg.bind(this));
  }

  private async checkUser():Promise<IUserInfo> {
    const userInfo = await userSrv.getUserInfo();
    if (!userInfo) {
      throw new Error('用户未登录,禁止发送消息');
    }

    if (userInfo.id !== this.userId) {
      this.userId = userInfo.id;
      this.clear();
    }

    return userInfo;
  }

  private async checkFriend(toUserId:string):Promise<IFriendInfo> {
    const friendList = await friendSrv.getMyFriendList();
    const friendInfo = friendList.find((item) => item.id === toUserId);
    if (!friendInfo) {
      throw new Error(`${toUserId} 不是您的好友，禁止发送消息！`);
    }

    return friendInfo;
  }

  private clear() {
    this.msgMap.clear();
  }

  private async sendSingleText(friendInfo:IFriendInfo, text: string): Promise<unknown> {
    const userInfo = await this.checkUser();

    return mqtt.singleMsg.send({
      charType: ECharType.single,
      msgType: EMsgType.text,
      msgTime: Date.now(),

      msgId: uuidv4(undefined),
      formId: userInfo.id,
      formName: userInfo.realName,
      toId: friendInfo.id,
      toName: friendInfo.realName,

      payload: {
        text,
      },
    });
  }

  sendMsg(toId:string, payload:IFilePayload | string) {

  }

  onReciveNewMsg(msg:IMessage) {
    console.log(msg, 'onReciveNewMsg');
  }
}

export default new MsgSrv();
