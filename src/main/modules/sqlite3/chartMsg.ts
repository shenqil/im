import { IMessage, EMsgStatus } from '@main/interface/msg';
import SQ3Base, { ESQ3Mode } from './base';

export interface ISQ3ChartMsg{
  insert(params:IMessage):Promise<unknown>
  updateStatus(msgId:string, msgStatus:EMsgStatus):Promise<number>
}

/**
 * 数据库公共类
 * */
class SQ3ChartMsg extends SQ3Base implements ISQ3ChartMsg {
  private tabelName:string;

  private tabelField:Array<string>;

  private tabelStruct:Array<string>;

  constructor() {
    super();
    this.tabelName = '';
    this.tabelField = ['msgId', 'id', 'formId', 'formName', 'toId', 'toName',
      'msgTime', 'charType', 'msgType', 'payload', 'msgStatus'];
    this.tabelStruct = [
      'msgId varchar(255) primary key NOT NULL',
      'id varchar(255)',
      'formId varchar(255)',
      'formName varchar(255)',
      'toId varchar(255)',
      'toName varchar(255)',
      'msgTime INTEGER',
      'charType varchar(255)',
      'msgType varchar(255)',
      'payload varchar(255)',
      'msgStatus varchar(255)',
    ];
  }

  async createTable(userId:string | undefined) {
    if (userId) {
      this.tabelName = `chart${userId.replaceAll('-', '_')}`;
      await super.createTable(this.tabelName, this.tabelStruct);
    }
  }

  /**
   * 插入一条新消息
   * */
  async insert(params:IMessage) {
    const values = [];
    for (const key of this.tabelField) {
      values.push(`${(params as any)[key] || ''}`);
    }
    await this.sql(
      `INSERT INTO ${this.tabelName} (${this.tabelField}) VALUES(${new Array(this.tabelField.length).fill('?')})`,
      values,
      ESQ3Mode.run,
    );
  }

  /**
   * 更新消息状态
   * */
  async updateStatus(msgId:string, msgStatus:EMsgStatus) {
    const time = Date.now();
    await this.sql(
      `UPDATE ${this.tabelName} SET msgStatus=? , msgTime=? WHERE msgId=?`,
      [msgStatus, time, msgId],
      ESQ3Mode.run,
    );

    return time;
  }
}

export default new SQ3ChartMsg();
