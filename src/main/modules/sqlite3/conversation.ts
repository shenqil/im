import SQ3Base, { ESQ3Mode } from './base';
import { EConversationType } from './enum';

export interface IConversationInfo {
  id: string,
  name: string,
  avatar:string,
  lastTime: number, // 最后一次操作的时间
  unreadNum: number, // 未读消息
  noDisturd: boolean, // 不打扰
  placedTop: boolean, // 消息置顶
  type: EConversationType, // 会话类型

  editorTextContent: string, // 编辑框内容

  lastMsg?:any, // 最后一条消息
}

export interface ISQ3Conversation{
  save(userId:string, v:IConversationInfo[]):Promise<unknown>,
  get(userId:string):Promise<IConversationInfo[]>
}

class SQ3Conversation extends SQ3Base implements ISQ3Conversation {
  private tabelName:string;

  private tabelField:Array<string>;

  private tabelStruct:Array<string>;

  constructor() {
    super();
    this.tabelName = 'conversation';
    this.tabelField = ['userId', 'list'];
    this.tabelStruct = ['userId varchar(255) PRIMARY KEY NOT NULL', 'list varchar(255) NOT NULL'];
  }

  async createTable() {
    await super.createTable(this.tabelName, this.tabelStruct);
  }

  async save(userId:string, list:IConversationInfo[]) {
    const v = JSON.stringify(list);
    return this.sql(`INSERT INTO ${this.tabelName} (${this.tabelField.join(',')}) VALUES ( ?, ? ) ON CONFLICT ( "userId" ) DO UPDATE SET list = ?;`, [userId, v, v], ESQ3Mode.run);
  }

  async get(userId:string):Promise<IConversationInfo[]> {
    const res = await this.sql(`SELECT * FROM ${this.tabelName} WHERE userId = ?`, userId, ESQ3Mode.get) as any;
    if (!res?.list) {
      return [];
    }
    const list = JSON.parse(res?.list);
    return list;
  }
}

export default new SQ3Conversation();
