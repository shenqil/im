import SQ3Base, { ESQ3Mode } from './base';

export interface IUserBaseInfo {
  id: string,
  avatar:string,
  userName: string,
  realName: string,
  phone: string,
  email: string
}

export interface ISQ3UserInfo {
  save(userId:string, info:IUserBaseInfo):Promise<unknown>,
  get(userId:string):Promise<IUserBaseInfo | undefined>,
  fetch(ids:string[]):Promise<IUserBaseInfo[]>
}

class SQ3UserInfo extends SQ3Base implements ISQ3UserInfo {
  private tabelName:string;

  private tabelField:Array<string>;

  private tabelStruct:Array<string>;

  constructor() {
    super();
    this.tabelName = 'userInfo';
    this.tabelField = ['userId', 'info'];
    this.tabelStruct = ['userId varchar(255) PRIMARY KEY NOT NULL', 'info varchar(255) NOT NULL'];
    this.createTable().catch((err) => {
      console.error(err);
    });
  }

  async createTable() {
    await super.createTable(this.tabelName, this.tabelStruct);
  }

  async save(userId:string, info:IUserBaseInfo) {
    const v = JSON.stringify(info);
    return this.sql(`INSERT INTO ${this.tabelName} (${this.tabelField.join(',')}) VALUES ( ?, ? ) ON CONFLICT ( "userId" ) DO UPDATE SET info = ?;`, [userId, v, v], ESQ3Mode.run);
  }

  async get(userId:string):Promise<IUserBaseInfo | undefined> {
    const res = await this.sql(`SELECT * FROM ${this.tabelName} WHERE userId = ?`, userId, ESQ3Mode.get) as any;
    if (!res?.info) {
      return undefined;
    }
    const info = JSON.parse(res?.info);
    return info;
  }

  async fetch(ids:string[]):Promise<IUserBaseInfo[]> {
    const pls = [...ids];
    const res = await this.sql(`SELECT * FROM ${this.tabelName} WHERE userId IN (${pls.fill('?')})`, ids, ESQ3Mode.all) as any;

    return res.map((item:any) => JSON.parse(item.info));
  }
}

export default new SQ3UserInfo();
