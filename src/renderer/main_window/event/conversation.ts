import { mainEvent, EMainEventKey } from '@renderer/public/ipcRenderer';
import { store } from '@renderer/main_window/store';
import type { IConversationInfo } from '@main/modules/sqlite3/interface';
import { changeConversationList, changeActivaId, conversationaRemove } from '@renderer/main_window/store/conversation';

// 监听会话列表变化
mainEvent.on(EMainEventKey.ConversationChange, (list:IConversationInfo[]) => {
  store.dispatch(changeConversationList(list));
});

// 监听选中会话变化
mainEvent.on(EMainEventKey.ConversationaAtivaIdChange, (id:string) => {
  store.dispatch(changeActivaId(id));
});

/**
 * 监听会话的删除
 * */
mainEvent.on(EMainEventKey.ConversationaRemove, (id:string) => {
  store.dispatch(conversationaRemove(id));
});
