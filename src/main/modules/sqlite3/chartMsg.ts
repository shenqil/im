import { IMessage } from '@main/interface/msg';
import SQ3Base from './base';

export interface ISQ3ChartMsg{

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
    this.tabelField = ['msgId', 'formId', 'formName', 'toId', 'toName',
      'msgTime', 'charType', 'msgType', 'payload', 'sendMsgStatus'];
    this.tabelStruct = [
      'msgId varchar(255) primary key NOT NULL',
      'formId varchar(255)',
      'formName varchar(255)',
      'toId varchar(255)',
      'toName varchar(255)',
      'msgTime INTEGER',
      'charType varchar(255)',
      'msgType varchar(255)',
      'payload varchar(255)',
      'sendMsgStatus varchar(255)',
    ];
  }

  async createTable(tabelName:string) {
    if (tabelName) {
      this.tabelName = tabelName;
      await super.createTable(this.tabelName, this.tabelStruct);
    }
  }
}

export default new SQ3ChartMsg();
