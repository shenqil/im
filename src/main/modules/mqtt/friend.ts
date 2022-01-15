import { EEventName, EFriendStatus } from '@main/modules/mqtt/enum';
import connect from './connect';

export interface IFriendInfo {
  id: string,
  avatar:string,
  userName: string,
  realName: string,
  phone: string,
  email: string
}

export interface IFriendOperateParam {
  formUserId:string,
  toUserId:string
}

export interface IQuasiFriendStatus{
  id:string,
  userID1:string,
  userID2:string,
  status1:EFriendStatus,
  status2:EFriendStatus,
  updatedAt:number
}

export interface IQuasiFriend {
  info:IFriendInfo
  status:IQuasiFriendStatus
}

export interface IFriend {
  search(keywords:string):Promise<IFriendInfo | undefined>
  myFriendList():Promise<Array<IFriendInfo>>
  quasiFriendList():Promise<Array<IQuasiFriend>>
  add(params:IFriendOperateParam):Promise<unknown>
  ignore(params:IFriendOperateParam):Promise<unknown>
  remove(params:IFriendOperateParam):Promise<unknown>
  onFriendChange(callback:Function):void
}

/**
 * 查询指定数据
 * */
async function search(keywords:string):Promise<IFriendInfo | undefined> {
  const res = await connect.sendMsgWaitReply({
    topic: 'friend/search',
    message: keywords,
    opts: {
      qos: 0,
      retain: false,
    },
  });
  if (!res) {
    return undefined;
  }
  return JSON.parse(res as string);
}

/**
 * 获取好友列表
 * */
async function myFriendList():Promise<Array<IFriendInfo>> {
  const res = await connect.sendMsgWaitReply({
    topic: 'friend/myFriends',
    message: connect.getManifest?.userID || Date.now().toString(),
    opts: {
      qos: 0,
      retain: false,
    },
  }) as string;

  if (res === 'null') {
    return [];
  }

  const { Data } = JSON.parse(res);

  return Data || [];
}

/**
 * 准好友列表
 * */
async function quasiFriendList() {
  const res = await connect.sendMsgWaitReply({
    topic: 'friend/quasiFriends',
    message: connect.getManifest?.userID || Date.now().toString(),
    opts: {
      qos: 0,
      retain: false,
    },
  }) as string;

  if (res === 'null') {
    return [];
  }

  const { Data } = JSON.parse(res);

  return Data || [];
}

/**
 * 添加好友
 * */
async function add(params:IFriendOperateParam):Promise<unknown> {
  return connect.sendMsgWaitReply({
    topic: 'friend/add',
    message: JSON.stringify(params),
    opts: {
      qos: 0,
      retain: false,
    },
  });
}

/**
 * 忽略对方好友请求
 * */
async function ignore(params:IFriendOperateParam):Promise<unknown> {
  return connect.sendMsgWaitReply({
    topic: 'friend/ignore',
    message: JSON.stringify(params),
    opts: {
      qos: 0,
      retain: false,
    },
  });
}

/**
 * 删除好友
 * */
async function remove(params:IFriendOperateParam):Promise<unknown> {
  return connect.sendMsgWaitReply({
    topic: 'friend/delete',
    message: JSON.stringify(params),
    opts: {
      qos: 0,
      retain: false,
    },
  });
}

/**
 * 监听事件
 * */
function onFriendChange(callback:Function) {
  connect.listen(EEventName.friendChange, callback);
}

export default {
  search,
  myFriendList,
  quasiFriendList,
  add,
  ignore,
  remove,
  onFriendChange,
};
