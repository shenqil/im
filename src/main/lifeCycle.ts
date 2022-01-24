import conversationSrv from '@main/server/conversationSrv';
import { sqlite3Init } from '@main/modules/sqlite3';
import friendSrv from '@main/server/friendSrv';
import groupSrv from '@main/server/groupSrv';
import userSrv from '@main/server/userSrv';
import msgSrv from '@main/server/msgSrv';
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

  // 初始化用户信息
  const userInfo = await userSrv.init();

  // 创建用户表
  await chartMsg.createTable(userInfo.id);
  // 初始化会话
  await conversationSrv.init(userInfo.id);
  // 初始化好友
  await friendSrv.init();
  // 初始化群组
  await groupSrv.init();
  // 初始化消息
  await msgSrv.init(userInfo);
}

/**
 * afterSignOut
 * 退出登录后
 * */
export async function afterSignOut() {
  console.log('afterSignOut');

  // 清空用户数据
  userSrv.clear();
  // 清空会话
  conversationSrv.clear();
  // 清空好友
  friendSrv.clear();
  // 清空群组
  groupSrv.clear();
  // 清空消息
  msgSrv.clear();
}

export default {};
