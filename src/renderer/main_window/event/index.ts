import { mainEvent, EMainEventKey } from '@renderer/public/ipcRenderer';
import { message } from 'antd';
import { store } from '@renderer/main_window/store';
import { changeActivaWithKey } from '@renderer/main_window/store/navigation';

import './friend';
import './group';
import './conversation';

mainEvent.on(EMainEventKey.UnifiedPrompt, ({ type, msg }:any) => {
  switch (type) {
    case 'success':
      message.success(msg);
      break;
    case 'error':
      message.error(msg);
      break;
    case 'warning':
      message.warning(msg);
      break;
    default:
      break;
  }
});

mainEvent.on(EMainEventKey.RouteChange, (key:string) => {
  store.dispatch(changeActivaWithKey(key));
});
