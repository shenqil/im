import connect from './connect';

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
}

/**
 * 获取当前用户信息
 * */
async function fetchUserInfo():Promise<IUserInfo> {
  if (!connect.getUserName) {
    throw new Error('用户未登录，不存在username');
  }
  const res = await connect.sendMsgWaitReply({
    topic: `IMServer/user/get/${connect.getUserName}`,
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
  if (!connect.getUserName) {
    throw new Error('用户未登录，不存在username');
  }
  const res = await connect.sendMsgWaitReply({
    topic: `IMServer/user/getToken/${connect.getUserName}`,
    message: '',
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
};
