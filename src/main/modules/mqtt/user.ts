import connect from './connect';

export interface IUser {
  fetchInfo():Promise<unknown>
  fetchToken():Promise<unknown>
}

/**
 * 获取当前用户信息
 * */
async function fetchUserInfo() {
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
  console.log(res, 'fetchUserInfo');
  return res;
}

/**
 * 获取token
 * */
async function fetchToken() {
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
  console.log(res, 'fetchToken');
  return res;
}

export default {
  fetchInfo: fetchUserInfo,
  fetchToken,
};
