import React from 'react';
import { IFriendInfo } from '@main/modules/mqtt/interface';
import Avatar from '@renderer/main_window/components/Avatar';
import styles from './index.scss';

interface IFriendItem {
  friendInfo:IFriendInfo
}
const FriendItem = function (props:IFriendItem) {
  const { friendInfo } = props;
  return (
    <div className={styles['friend-item']}>
      <div className={styles['friend-item__avatar']}>
        <Avatar url={friendInfo.avatar} />
      </div>

      <div className={styles['friend-item__info']}>
        <div className={styles['friend-item__info-real-name']}>
          {friendInfo.realName}
        </div>
        <div className={styles['friend-item__info-nick-name']}>
          {friendInfo.userName}
        </div>
      </div>
    </div>
  );
};

export default FriendItem;
