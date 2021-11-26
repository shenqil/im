import React from 'react';
import { mainBridge } from '@renderer/public/ipcRenderer';
import styles from './index.scss';

const Friend = function () {
  mainBridge.server.friendSrv.getMyFriendList()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err);
    });

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
