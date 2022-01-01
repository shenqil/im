import ipcEvent from '@main/ipcMain/event';
import { EMainEventKey } from '@main/ipcMain/eventInterface';
import SQ3 from '@main/modules/sqlite3';
import { IConversationInfo, EConversationType } from '@main/modules/sqlite3/conversation';
import type { IFriendInfo } from '@main/modules/mqtt/interface';
import { throttle } from 'throttle-debounce';
import userSrv from './userSrv';

export interface IConversationSrv {
  get():Promise<IConversationInfo[]>,
  set(list:IConversationInfo[]):Promise<unknown>,
  gotoConversation(info:IFriendInfo): Promise<unknown>,
  setActivaId(id:string):Promise<unknown>
  getActivaId():Promise<string>
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
      SQ3.conversation.save(this.userId, list)
        .catch(((err) => {
          console.error(err);
        }));
    });
  }

  private async check():Promise<unknown> {
    const userInfo = await userSrv.getUserInfo();

    if (this.userId !== userInfo.id) {
      this.list = [];
      this.userId = userInfo.id;
    }

    return '';
  }

  async get():Promise<IConversationInfo[]> {
    await this.check();

    if (!this.list.length) {
      this.list = await SQ3.conversation.get(this.userId);
      ipcEvent.emit(EMainEventKey.ConversationChange, this.list);
    }

    return this.list;
  }

  async set(list: IConversationInfo[]): Promise<unknown> {
    await this.check();

    ipcEvent.emit(EMainEventKey.ConversationChange, list);
    this.throttleSave(list);

    this.list = list;
    return '';
  }

  async setActivaId(id:string) {
    this.activaId = id;
    ipcEvent.emit(EMainEventKey.ConversationaAtivaIdChange, id);
  }

  async getActivaId():Promise<string> {
    return this.activaId;
  }

  async gotoConversation(info:IFriendInfo) {
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
}

export default new ConversationSrv();
