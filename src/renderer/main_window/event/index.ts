import { mainEvent, EMainEventKey } from '@renderer/public/ipcRenderer';
import { message } from 'antd';
import './friend';

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
