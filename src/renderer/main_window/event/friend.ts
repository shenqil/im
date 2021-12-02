import { mainEvent, EMainEventKey, mainBridge } from '@renderer/public/ipcRenderer';
import type { IFriendInfo } from '@main/modules/mqtt/interface';
import type { IQuasiFriendSrv } from '@main/server/interface';
import { store } from '@renderer/main_window/store';
import { changeFriendList, changeQuasiFriendList } from '@renderer/main_window/store/friend';

// 监听好友列表变化
mainEvent.on(EMainEventKey.MyFriendChange, (list:IFriendInfo[]) => {
  console.log(list, 'friendList');
  store.dispatch(changeFriendList(list));
});
mainBridge.server.friendSrv.getMyFriendList();

// 监听准好友变化
mainEvent.on(EMainEventKey.QuasiFriendChange, (list:IQuasiFriendSrv[]) => {
  console.log(list, 'quasiFriendList');
  store.dispatch(changeQuasiFriendList(list));
});
mainBridge.server.friendSrv.getQuasiFriendList();

export default {};
