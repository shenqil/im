import SQ3Base, { ESQ3Mode } from './base';

export enum ESQ3CommonKey {
  userLoginInfo = 'USER_LOGIN_INFO',
  config = 'CONFIG',
}

export interface ISQ3Common{
  saveData(key:ESQ3CommonKey, v:string):Promise<unknown>,
  getData(key:ESQ3CommonKey):Promise<string>
}

/**
 * 数据库公共类 使用key v来存储一些常用数据
 * */
class SQ3Common extends SQ3Base {
  private tabelName:string;

  private tabelField:Array<string>;

  private tabelStruct:Array<string>;

  constructor() {
    super();
    this.tabelName = 'common';
    this.tabelField = ['key', 'value'];
    this.tabelStruct = ['key varchar(255) PRIMARY KEY NOT NULL', 'value varchar(255) NOT NULL'];
  }

  async createTable() {
    await super.createTable(this.tabelName, this.tabelStruct);
  }

  async saveData(key:ESQ3CommonKey, v:string) {
    return this.sql(`INSERT INTO ${this.tabelName} (${this.tabelField.join(',')}) VALUES ( ?, ? ) ON CONFLICT ( "key" ) DO UPDATE SET value = ?;`, [key, v, v], ESQ3Mode.run);
  }

  async getData(key:ESQ3CommonKey):Promise<string> {
    const res = await this.sql(`SELECT * FROM ${this.tabelName} WHERE key = ?`, key, ESQ3Mode.get) as any;
    if (!res?.value) {
      return '';
    }
    return res?.value as string;
  }
}

export default new SQ3Common();
