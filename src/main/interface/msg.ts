/**
 * 聊天类型
 * */
export enum ECharType {
  single = 'singleMsg',
  group = 'groupMsg',
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
 * 发送消息状态
 * */
export enum EMsgStatus{
  sendPending = 'SEND_PENDING',
  sendFulfilled = 'SEND_FULFILLED',
  sendRejected = 'SEND_REJECTED',
  reciveAccepted = 'RECIVE_ACCEPTED',
  reciveRead = 'RECIVE_READ',
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
  id:string,
  msgId:string,
  formId:string,
  formName:string,
  toId:string,
  toName:string,
  msgTime:number,
  charType:ECharType,
  msgType:EMsgType,
  payload:string | IFilePayload | ICardPayload,

  msgStatus?:EMsgStatus // 发送状态
}
