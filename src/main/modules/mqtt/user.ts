import connect from './connect';
import type { IFriendInfo } from './friend';

export interface IUserRole {
  userId: string,
  roleId: string
}

export interface IUserInfo {
  id: string,
  avatar:string,
  userName: string,
  realName: string,
  password?: string,
  phone?: string,
  email?: string,
  status: number,
  creator?: string,
  createdAt?: string,
  userRoles?: Array<IUserRole>
}

export interface IToken {
  accessToken: string,
  expiresAt: number,
  tokenType: string
}

export interface IUser {
  fetchInfo():Promise<IUserInfo>
  fetchToken():Promise<IToken>
  getFriendInfo(iDs:string[]):Promise<IFriendInfo[]>
}

/**
 * 获取当前用户信息
 * */
async function fetchUserInfo():Promise<IUserInfo> {
  const res = await connect.sendMsgWaitReply({
    topic: 'user/get',
    message: '',
    opts: {
      qos: 0,
      retain: false,
    },
  });
  return JSON.parse(res as string);
}

/**
 * 获取token
 * */
async function fetchToken():Promise<IToken> {
  const res = await connect.sendMsgWaitReply({
    topic: 'user/getToken',
    message: '',
    opts: {
      qos: 0,
      retain: false,
    },
  });
  return JSON.parse(res as string);
}

/**
 * 获取好友信息
 * */
async function getFriendInfo(iDs:string[]):Promise<IFriendInfo[]> {
  const res = await connect.sendMsgWaitReply({
    topic: 'user/userInfo',
    message: JSON.stringify(iDs),
    opts: {
      qos: 0,
      retain: false,
    },
  });
  return JSON.parse(res as string);
}

export default {
  fetchInfo: fetchUserInfo,
  fetchToken,
  getFriendInfo,
};
