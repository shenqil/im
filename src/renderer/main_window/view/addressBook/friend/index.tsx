import React, { FC, useEffect } from 'react';
import { mainBridge } from '@renderer/public/ipcRenderer';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectFriendList } from '@renderer/main_window/store/friend';
import styles from './index.scss';

const Friend:FC = function () {
  const friendList = useAppSelector(selectFriendList);

  useEffect(() => {
    console.log(friendList, 'friendList');
  }, [friendList]);

  function openAddFriendWin() {
    mainBridge.wins.addFriend.openWin();
  }

  return (
    <div className={styles.friend}>
      <div className={styles.friend__header}>
        <div className={styles['friend__header-title']}>
          我的好友
        </div>

        <i className={`iconfont icon-tianjiahaoyou ${styles['friend__header-add']}`} onClick={openAddFriendWin} aria-hidden="true" />
      </div>

      <div className={styles.friend__container}>
        好友内容
        {JSON.stringify(friendList)}
      </div>
    </div>
  );
};

export default Friend;
