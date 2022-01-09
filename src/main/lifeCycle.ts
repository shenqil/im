import conversationSrv from '@main/server/conversationSrv';
import friendSrv from '@main/server/friendSrv';
import groupSrv from '@main/server/groupSrv';
/**
 * appReady
 * 此时主进程加载完毕，但是窗口还未开始创建
 * */
export async function appReady() {
  console.log('appReady');
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
  await conversationSrv.get();
  await conversationSrv.getActivaId();
  await friendSrv.myFriendList();
  await friendSrv.quasiFriendList();
  await groupSrv.myGroupList();
}

export default {};
