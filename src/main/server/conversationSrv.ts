import ipcEvent from '@main/ipcMain/event';
import { EMainEventKey } from '@main/ipcMain/eventInterface';
import SQ3 from '@main/modules/sqlite3';
import { EConversationType } from '@main/modules/sqlite3/enum';
import { IConversationInfo } from '@main/modules/sqlite3/conversation';
import type { IFriendInfo, IGroupInfo } from '@main/modules/mqtt/interface';
import { throttle } from 'throttle-debounce';
import type { IUserBaseInfo } from '@main/modules/sqlite3/interface';
import { EMsgStatus, IMessage } from '@main/interface/msg';
import friendSrv from './friendSrv';
import groupSrv from './groupSrv';

export interface IConversationSrv {
  getConversationInfoById(id:string):Promise<IConversationInfo | undefined>
  get():Promise<IConversationInfo[]>,
  set(list:IConversationInfo[]):Promise<unknown>,
  gotoConversation(info:IFriendInfo): Promise<unknown>,
  gotoConversation(info:IGroupInfo): Promise<unknown>,
  setActivaId(id:string):Promise<unknown>
  getActivaId():Promise<string>
  updateConversationInfo(info:IConversationInfo):Promise<unknown>
  removeConversationInfo(id:string):Promise<unknown>

  updateWithUserInfo(userInfo:IUserBaseInfo):void
  updateWithGroupInfo(groupInfo:IGroupInfo):void
}

class ConversationSrv implements IConversationSrv {
  private userId:string;

  private list:IConversationInfo[];

  private activaId:string;

  private throttleSave:Function;

  constructor() {
    this.userId = '';
    this.list = [];
    this.activaId = '';

    // 节流推送和储存到数据库中
    this.throttleSave = throttle(800, false, (list:IConversationInfo[]) => {
      if (!this.userId) {
        return;
      }
      ipcEvent.emit(EMainEventKey.ConversationChange, list);
      SQ3.conversation.save(this.userId, list)
        .catch(((err) => {
          console.error(err);
        }));
    });

    // 订阅
    ipcEvent.on(EMainEventKey.MsgInsert, this.updateWithMsg.bind(this));
    ipcEvent.on(EMainEventKey.MsgUpdate, this.updateWithMsg.bind(this));
  }

  /**
   * 初始化
   * */
  async init(userId:string) {
    this.clear();
    this.userId = userId;
    await this.get();
  }

  /**
   * 清空数据
   * */
  clear() {
    this.list = [];
    this.activaId = '';
    this.userId = '';
  }

  /**
   * 通过会话id获取一个的会话信息
   * */
  async getConversationInfoById(id:string) {
    // 1.先获取缓存
    let conversationItem = this.list.find((item) => item.id === id);
    if (conversationItem) {
      return conversationItem;
    }

    // 2.在好友列表中查找
    const friendList = await friendSrv.getMyFriendList();
    const friendItem = friendList.find((item) => item.id === id);
    if (friendItem) {
      conversationItem = {
        id,
        name: friendItem.realName,
        avatar: friendItem.avatar,
        lastTime: Date.now(),
        unreadNum: 0,
        noDisturd: false,
        placedTop: false,
        type: EConversationType.single,
      };

      this.list.push(conversationItem);
      this.set(this.list);

      return conversationItem;
    }

    // 3.在群组列表中查找
    const groupList = await groupSrv.getMyGroupList();
    const groupItem = groupList.find((item) => item.id === id);
    if (groupItem) {
      conversationItem = {
        id,
        name: groupItem.groupName,
        avatar: groupItem.avatar,
        lastTime: Date.now(),
        unreadNum: 0,
        noDisturd: false,
        placedTop: false,
        type: EConversationType.group,
      };

      this.list.push(conversationItem);
      this.set(this.list);
      return conversationItem;
    }

    return undefined;
  }

  /**
   * 根据用户信息更新会话
   * */
  updateWithUserInfo(userInfo:IUserBaseInfo) {
    const conversation = this.list.find((item) => item.id === userInfo.id);
    if (conversation) {
      conversation.avatar = userInfo.avatar;
      conversation.name = userInfo.realName;
      this.set(this.list);
    }
  }

  /**
   * 根据群信息更新会话
   * */
  updateWithGroupInfo(groupInfo:IGroupInfo) {
    const conversation = this.list.find((item) => item.id === groupInfo.id);
    if (conversation) {
      conversation.avatar = groupInfo.avatar;
      conversation.name = groupInfo.groupName;
      this.set(this.list);
    }
  }

  /**
   * 根据消息更新会话
   * */
  async updateWithMsg(msg:IMessage) {
    const conversationId = msg.formId === this.userId ? msg.toId : msg.formId;

    const conversation = await this.getConversationInfoById(conversationId);
    if (conversation) {
      const oldMsg = conversation.lastMsg || { msgTime: 0 };

      // 更新会话内的最后一条消息
      if (msg.msgTime >= oldMsg.msgTime) {
        conversation.lastMsg = msg;
        conversation.lastTime = msg.msgTime;
        this.set(this.list);
      }

      // 更新会话的未读数
      if (conversation.id !== this.activaId && msg.msgStatus === EMsgStatus.reciveAccepted) {
        conversation.unreadNum++;
        this.set(this.list);
      }
    }
  }

  /**
   * 获取会话列表
   * */
  async get():Promise<IConversationInfo[]> {
    if (!this.userId) {
      return [];
    }

    if (!this.list.length) {
      this.list = await SQ3.conversation.get(this.userId);
      ipcEvent.emit(EMainEventKey.ConversationChange, this.list);
    }

    return this.list;
  }

  /**
   * 设置会话列表
   * */
  async set(list: IConversationInfo[]): Promise<unknown> {
    if (!this.userId) {
      return;
    }

    this.throttleSave(list);

    this.list = list;
  }

  /**
   * 设置选中会话的id
   * */
  async setActivaId(id:string) {
    this.activaId = id;
    ipcEvent.emit(EMainEventKey.ConversationaAtivaIdChange, id);

    const conversationItem = this.list.find((item) => item.id === id);
    if (conversationItem) {
      conversationItem.unreadNum = 0;
      this.set(this.list);
    }
  }

  /**
   * 获取选中会话id
   * */
  async getActivaId():Promise<string> {
    return this.activaId;
  }

  /**
   * 从好友跳转到会话
   * */
  private async gotoConversationWithFriendInfo(info:IFriendInfo) {
    let conversation = this.list.find((item) => item.id === info.id);
    if (!conversation) {
      conversation = {
        id: info.id,
        name: info.realName,
        avatar: info.avatar,
        lastTime: Date.now(),
        unreadNum: 0,
        noDisturd: false,
        placedTop: false,
        type: EConversationType.single,
      };
      this.list.unshift(conversation);
    } else {
      conversation.name = info.realName;
      conversation.avatar = info.avatar;
    }
    // 保存更改得列表
    await this.set(this.list);
    // 选中会话
    this.setActivaId(info.id);
    // 跳转路由
    ipcEvent.emit(EMainEventKey.RouteChange, 'msg');
  }

  /**
   * 从群组跳转到会话
   * */
  private async gotoConversationWithGroupInfo(info:IGroupInfo) {
    let conversation = this.list.find((item) => item.id === info.id);
    if (!conversation) {
      conversation = {
        id: info.id,
        name: info.groupName,
        avatar: info.avatar,
        lastTime: Date.now(),
        unreadNum: 0,
        noDisturd: false,
        placedTop: false,
        type: EConversationType.group,
      };
      this.list.unshift(conversation);
    } else {
      conversation.name = info.groupName;
      conversation.avatar = info.avatar;
    }
    // 保存更改得列表
    await this.set(this.list);
    // 选中会话
    this.setActivaId(info.id);
    // 跳转路由
    ipcEvent.emit(EMainEventKey.RouteChange, 'msg');
  }

  /**
   * 跳转到会话
   * */
  async gotoConversation(info:IFriendInfo | IGroupInfo) {
    if (typeof (info as IGroupInfo).groupName === 'string') {
      await this.gotoConversationWithGroupInfo(info as IGroupInfo);
    } else {
      await this.gotoConversationWithFriendInfo(info as IFriendInfo);
    }
  }

  /**
   * 更新会话信息
   * */
  async updateConversationInfo(info:IConversationInfo) {
    const index = this.list.findIndex((item) => item.id === info.id);
    if (index !== -1) {
      this.list.splice(index, 1, info);
    } else {
      this.list.unshift(info);
    }
    await this.set(this.list);
  }

  /**
   * 删除会话
   * */
  async removeConversationInfo(id:string) {
    const index = this.list.findIndex((item) => item.id === id);
    if (index === -1) {
      return;
    }

    this.list.splice(index, 1);
    ipcEvent.emit(EMainEventKey.ConversationaRemove, id);

    await this.set(this.list);
  }
}

export default new ConversationSrv();
