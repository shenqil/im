import React, { FC } from 'react';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectConversationSortList } from '@renderer/main_window/store/conversation';
import styles from './index.scss';

const Conversation:FC = function () {
  const conversationList = useAppSelector(selectConversationSortList);
  return (
    <div className={`scroll ${styles.conversation}`}>
      {JSON.stringify(conversationList)}
    </div>
  );
};

export default Conversation;
