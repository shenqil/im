import React, { FC } from 'react';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectActivaConversation } from '@renderer/main_window/store/conversation';
import styles from './index.scss';
import Conversation from './conversation';
import ConversationHeader from './conversationHeader';

const Msg:FC = function () {
  const conversationInfo = useAppSelector(selectActivaConversation);
  return (
    <div className={styles.msg}>
      <div className={styles.msg__left}>
        <Conversation />
      </div>

      <div className={styles.msg__right}>
        {
          conversationInfo
          && (
            <div className={styles['msg__right-head']}>
              <ConversationHeader conversationInfo={conversationInfo} />
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Msg;
