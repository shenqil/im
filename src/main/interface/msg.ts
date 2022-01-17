/**
 * 聊天类型
 * */
export enum ECharType {
  single = 'SINGLE',
  group = 'GROUP',
}

/**
 * 消息类型
 * */
export enum EMsgType {
  text = 'TEXT',
  img = 'IMG',
  file = 'file',
}

/**
 * 定义文本相关结构
 * */
export interface ITextPayload {
  text:string
}

/**
 * 定义文件结构
 * */
export interface IFilePayload {
  fileRealName: string,
  fileSize: string,
  fileUrl?: string,
  localPath?:string // 本地路径
}

/**
 * 定义名片结构
 * */
export interface ICardPayload {
  cardID: string,
  cardName: string,
  cardImg: string,
}

/**
 * 定义基本消息结构
 * */
export interface IMessage{
  msgId:string,
  formId:string,
  formName:string,
  toId:string,
  toName:string,
  msgTime:number,
  charType:ECharType,
  msgType:EMsgType,
  payload:ITextPayload | IFilePayload | ICardPayload
}
