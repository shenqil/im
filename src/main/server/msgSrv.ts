/* eslint-disable class-methods-use-this */
import {
  IMessage, EMsgType, EMsgStatus, ECharType,
} from '@main/interface/msg';
import type { IUserInfo } from '@main/modules/mqtt/interface';
import mqtt from '@main/modules/mqtt';
import sqlite3 from '@main/modules/sqlite3';
import ipcEvent from '@main/ipcMain/event';
import { EMainEventKey } from '@main/ipcMain/eventInterface';

export interface IMsgSrv {
  sendMsg(msg:IMessage):Promise<unknown>,
  onReciveNewMsg(msg:IMessage):void,
  fetchBeforeByTime(id: string, msgTime: number, page: number, limit: number):Promise<IMessage[]>
}

class MsgSrv implements IMsgSrv {
  msgQueue:IMessage[];

  msgFlag:boolean;

  userInfo:IUserInfo | undefined;

  conversationActivaId:string;

  constructor() {
    this.msgQueue = [];
    this.msgFlag = false;
    this.init(undefined);
    this.listenMQTTEvent();
    this.conversationActivaId = '';
    ipcEvent.on(EMainEventKey.ConversationaAtivaIdChange, (id:string) => {
      this.conversationActivaId = id;
    });
  }

  /**
   * 监听mqtt 事件
   *
   * 每次退出登录后,事件会被清空
   * */
  listenMQTTEvent() {
    mqtt.msg.onReciveNewMsg(this.onReciveNewMsg.bind(this));
  }

  /**
   * 初始化
   * */
  async init(userInfo:IUserInfo | undefined) {
    this.userInfo = userInfo;
    this.consumeMsgQueue();
  }

  /**
   * 清空数据
   * */
  clear() {
    this.userInfo = undefined;
    this.msgQueue = [];
    this.msgFlag = false;
    this.conversationActivaId = '';

    this.listenMQTTEvent();
  }

  /**
   * 保存一条新消息
   * */
  private async saveMsg(msg:IMessage) {
    await sqlite3.chartMsg.insert(msg);
    ipcEvent.emit(EMainEventKey.MsgInsert, msg);
  }

  /**
   * 获取指定时间之前的消息列表
   * */
  async fetchBeforeByTime(id: string, msgTime: number, page: number, limit: number) {
    return sqlite3.chartMsg.fetchBeforeByTime(id, msgTime, page, limit);
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

  /**
   * 消费
   * */
  consumeMsgQueue() {
    if (!this.userInfo) {
      return;
    }
    const msgItem = this.msgQueue.shift();
    if (!msgItem || this.msgFlag) {
      return;
    }

    this.msgFlag = true;
    this.saveMsg(msgItem)
      .finally(() => {
        this.msgFlag = false;
        this.consumeMsgQueue();
      });
  }

  onReciveNewMsg(msg:IMessage) {
    this.msgQueue.push({
      ...msg,
      conversationId: msg.charType === ECharType.single ? msg.formId : msg.toId,
      msgStatus: this.conversationActivaId === msg.formId
        ? EMsgStatus.reciveRead
        : EMsgStatus.reciveAccepted,
    });
    this.consumeMsgQueue();
  }
}

export default new MsgSrv();
