import { mainEvent, EMainEventKey } from '@renderer/public/ipcRenderer';
import type { IGroupInfo } from '@main/modules/mqtt/interface';
import { store } from '@renderer/main_window/store';
import { changeGroupList } from '@renderer/main_window/store/group';

// 监听群组列表变化
mainEvent.on(EMainEventKey.MyGroupChange, (list:IGroupInfo[]) => {
  // console.log(list, 'groupList');
  store.dispatch(changeGroupList(list));
});

export default {};
