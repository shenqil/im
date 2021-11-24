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

export interface IFriend {
  search(keywords:string):Promise<IFriendInfo | undefined>
  fetchList():Promise<Array<IFriendInfo>>
  add(params:IFriendOperateParam):Promise<unknown>
  remove(params:IFriendOperateParam):Promise<unknown>
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
async function fetchList():Promise<Array<IFriendInfo>> {
  const res = await connect.sendMsgWaitReply({
    topic: 'friend/myFriend',
    message: Date.now().toString(),
    opts: {
      qos: 0,
      retain: false,
    },
  });
  if (!res) {
    return [];
  }
  return JSON.parse(res as string);
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
export default {
  search,
  fetchList,
  add,
  remove,
};
