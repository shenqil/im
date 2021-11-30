import { mainEvent, EMainEventKey, mainBridge } from '@renderer/public/ipcRenderer';
import { IFriendInfo } from '@main/modules/mqtt/interface';
import { store } from '@renderer/main_window/store';
import { changeFriendList } from '@renderer/main_window/store/friend';

// 监听好友列表变化
mainEvent.on(EMainEventKey.MyFriendChange, (list:IFriendInfo[]) => {
  store.dispatch(changeFriendList(list));
});

mainBridge.server.friendSrv.getMyFriendList();

export default {};
