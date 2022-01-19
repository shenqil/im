import conversationSrv from '@main/server/conversationSrv';
import { sqlite3Init } from '@main/modules/sqlite3';
import friendSrv from '@main/server/friendSrv';
import groupSrv from '@main/server/groupSrv';
import userSrv from '@main/server/userSrv';
import chartMsg from '@main/modules/sqlite3/chartMsg';
/**
 * appReady
 * 此时主进程加载完毕，但是窗口还未开始创建
 * */
export async function appReady() {
  console.log('appReady');
  // 初始化数据库，创建好对应的表
  sqlite3Init();
}

/**
 * beforeLogin
 * 登录界面已打开，但是还未登录
 * */
export async function beforeLogin() {
  console.log('beforeLogin');
}

/**
 * afterLogin
 * 主界面已打开,已登录成功
 * */
export async function afterLogin() {
  console.log('afterLogin');

  // 拿到用户信息
  const userInfo = await userSrv.getUserInfo();

  // 创建用户表
  await chartMsg.createTable(userInfo.id);
  await conversationSrv.init(userInfo.id);
  await friendSrv.init();
  await groupSrv.init();
}

/**
 * afterSignOut
 * 退出登录后
 * */
export async function afterSignOut() {
  console.log('afterSignOut');

  userSrv.clear();
  conversationSrv.clear();
  friendSrv.clear();
  groupSrv.clear();
}

export default {};
