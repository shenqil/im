import React, { FC, useEffect, useState } from 'react';
import { IMessage } from '@main/interface/msg';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectUserInfo } from '@renderer/main_window/store/user';
import Avatar from '@renderer/main_window/components/Avatar';
import styles from './index.scss';

export interface IChatItemProps {
  msg:IMessage
}
const ChatItem:FC<IChatItemProps> = function (props) {
  const { msg } = props;
  const userInfo = useAppSelector(selectUserInfo);
  const [isSelf, setIsSelf] = useState<boolean>(false);

  useEffect(() => {
    if (!userInfo) {
      return;
    }
    if (userInfo.id === msg.formId) {
      setIsSelf(true);
    } else {
      setIsSelf(false);
    }
  }, [userInfo, msg]);

  return (
    <div className={`${styles['chat-item']} ${isSelf && styles['chat-item--self']}`}>
      <div className={styles['chat-item__avatar']}>
        <Avatar url={userInfo?.avatar || ''} />
      </div>

      <div className={styles['chat-item__content']}>
        {JSON.stringify(msg)}
      </div>
    </div>
  );
};

export default ChatItem;
