import React, { FC } from 'react';
import { mainBridge } from '@renderer/public/ipcRenderer';
import { useAppSelector, useAppDispatch } from '@renderer/main_window/store/hooks';
import { selectFriendList, fetchFriendListAsync } from '@renderer/main_window/store/friend';
import styles from './index.scss';

const Friend:FC = function () {
  const friendList = useAppSelector(selectFriendList);
  const dispatch = useAppDispatch();
  if (friendList.length === 0) {
    dispatch(fetchFriendListAsync());
  }

  console.log(friendList, 'friendList');

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
      </div>
    </div>
  );
};

export default Friend;
