import React, { FC } from 'react';
import styles from './index.scss';

const ChatBox:FC = function () {
  return (
    <div className={`scroll ${styles['chat-box']}`}>
      chat-box
    </div>
  );
};

export default ChatBox;
