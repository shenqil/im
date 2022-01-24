import { mainEvent, EMainEventKey } from '@renderer/public/ipcRenderer';
import { IMessage } from '@main/interface/msg';
import { insert, update } from '@renderer/main_window/store/msg';
import { store } from '../store';

// 监听消息插入
mainEvent.on(EMainEventKey.MsgInsert, (msg:IMessage) => {
  // console.log(msg, 'insert');
  store.dispatch(insert(msg));
});

// 监听消息更新
mainEvent.on(EMainEventKey.MsgUpdate, (msg:IMessage) => {
  // console.log(msg, 'update');
  store.dispatch(update(msg));
});
