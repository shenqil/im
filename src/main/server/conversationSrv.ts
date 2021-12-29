import SQ3 from '@main/modules/sqlite3';
import type { IConversationInfo } from '@main/modules/sqlite3/interface';
import userSrv from './userSrv';

export interface IConversationSrv {
  get():Promise<IConversationInfo[]>,
  set(list:IConversationInfo[]):Promise<unknown>
}

class ConversationSrv implements IConversationSrv {
  private userId:string;

  private list:IConversationInfo[];

  constructor() {
    this.userId = '';
    this.list = [];
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
    }

    return this.list;
  }

  async set(list: IConversationInfo[]): Promise<unknown> {
    await this.check();

    await SQ3.conversation.save(this.userId, list);

    this.list = list;
    return '';
  }
}

export default new ConversationSrv();
