import ipcEvent from '@main/ipcMain/event';
import { EMainEventKey } from '@main/ipcMain/eventInterface';
import SQ3 from '@main/modules/sqlite3';
import { IConversationInfo, EConversationType } from '@main/modules/sqlite3/conversation';
import type { IFriendInfo, IGroupInfo } from '@main/modules/mqtt/interface';
import { throttle } from 'throttle-debounce';
import type { IUserBaseInfo } from '@main/modules/sqlite3/interface';

export interface IConversationSrv {
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
    this.throttleSave = throttle(1500, false, (list:IConversationInfo[]) => {
      if (!this.userId) {
        return;
      }
      ipcEvent.emit(EMainEventKey.ConversationChange, list);
      SQ3.conversation.save(this.userId, list)
        .catch(((err) => {
          console.error(err);
        }));
    });
  }

  async init(userId:string) {
    this.clear();
    this.userId = userId;
    await this.get();
  }

  clear() {
    this.list = [];
    this.activaId = '';
    this.userId = '';
  }

  updateWithUserInfo(userInfo:IUserBaseInfo) {
    const conversation = this.list.find((item) => item.id === userInfo.id);
    if (conversation) {
      conversation.avatar = userInfo.avatar;
      conversation.name = userInfo.realName;
      this.set(this.list);
    }
  }

  updateWithGroupInfo(groupInfo:IGroupInfo) {
    const conversation = this.list.find((item) => item.id === groupInfo.id);
    if (conversation) {
      conversation.avatar = groupInfo.avatar;
      conversation.name = groupInfo.groupName;
      this.set(this.list);
    }
  }

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

  async set(list: IConversationInfo[]): Promise<unknown> {
    if (!this.userId) {
      return;
    }

    this.throttleSave(list);

    this.list = list;
  }

  async setActivaId(id:string) {
    this.activaId = id;
    ipcEvent.emit(EMainEventKey.ConversationaAtivaIdChange, id);
  }

  async getActivaId():Promise<string> {
    return this.activaId;
  }

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
        editorTextContent: '',
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
        editorTextContent: '',
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

  async gotoConversation(info:IFriendInfo | IGroupInfo) {
    if (typeof (info as IGroupInfo).groupName === 'string') {
      await this.gotoConversationWithGroupInfo(info as IGroupInfo);
    } else {
      await this.gotoConversationWithFriendInfo(info as IFriendInfo);
    }
  }

  async updateConversationInfo(info:IConversationInfo) {
    const index = this.list.findIndex((item) => item.id === info.id);
    if (index !== -1) {
      this.list.splice(index, 1, info);
    } else {
      this.list.unshift(info);
    }
    await this.set(this.list);
  }

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
