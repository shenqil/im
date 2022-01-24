import React, { FC } from 'react';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectMsgListByCurConversation } from '@renderer/main_window/store/msg';
import styles from './index.scss';

const ChatBox:FC = function () {
  const msgList = useAppSelector(selectMsgListByCurConversation);
  return (
    <div className={`scroll ${styles['chat-box']}`}>
      {JSON.stringify(msgList.map((item) => item.payload))}
    </div>
  );
};

export default ChatBox;
