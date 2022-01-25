/* eslint-disable class-methods-use-this */
import { IMessage, EMsgType, EMsgStatus } from '@main/interface/msg';
import type { IUserInfo } from '@main/modules/mqtt/interface';
import mqtt from '@main/modules/mqtt';
import sqlite3 from '@main/modules/sqlite3';
import ipcEvent from '@main/ipcMain/event';
import { EMainEventKey } from '@main/ipcMain/eventInterface';

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

  /**
   * 保存一条新消息
   * */
  private async saveMsg(msg:IMessage) {
    await sqlite3.chartMsg.insert(msg);
    ipcEvent.emit(EMainEventKey.MsgInsert, msg);
  }

  /**
   * 更新消息状态
   * */
  private async updateMsgStatus(msg:IMessage) {
    const time = await sqlite3.chartMsg.updateStatus(
      msg.msgId,
      msg.msgStatus || EMsgStatus.sendFulfilled,
    );
    ipcEvent.emit(EMainEventKey.MsgUpdate, {
      ...msg,
      msgTime: time,
    });
  }

  /**
   * 发送一条消息
   * */
  async sendMsg(msg:IMessage) {
    if (!this.userInfo) {
      throw new Error('用户未登录,禁止发送消息');
    }

    switch (msg.msgType) {
      case EMsgType.text:
      {
        try {
          this.saveMsg({
            ...msg,
            msgStatus: EMsgStatus.sendPending,
          });
          await mqtt.msg.send(msg);
          this.updateMsgStatus({
            ...msg,
            msgStatus: EMsgStatus.sendFulfilled,
          });
        } catch (error) {
          console.error(error);

          // 消息发送失败
          this.updateMsgStatus({
            ...msg,
            msgStatus: EMsgStatus.sendRejected,
          });
        }
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
