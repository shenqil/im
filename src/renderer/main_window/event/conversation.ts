import { mainEvent, EMainEventKey, mainBridge } from '@renderer/public/ipcRenderer';
import { store } from '@renderer/main_window/store';
import type { IConversationInfo } from '@main/modules/sqlite3/interface';
import { changeConversationList, changeActivaId } from '@renderer/main_window/store/conversation';

// 监听会话列表变化
mainEvent.on(EMainEventKey.ConversationChange, (list:IConversationInfo[]) => {
  store.dispatch(changeConversationList(list));
});

// 监听选中会话变化
mainEvent.on(EMainEventKey.ConversationaAtivaIdChange, (id:string) => {
  store.dispatch(changeActivaId(id));
});
mainBridge.server.conversationSrv.get();
mainBridge.server.conversationSrv.getActivaId();
