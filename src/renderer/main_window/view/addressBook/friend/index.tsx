import React from 'react';
import styles from './index.scss';

const Friend = function () {
  return (
    <div className={styles.friend}>
      <div className={styles.friend__header}>
        <div className={styles['friend__header-title']}>
          我的好友
        </div>

        <i className={`iconfont icon-tianjiahaoyou ${styles['friend__header-add']}`} />
      </div>

      <div className={styles.friend__container}>
        好友内容
      </div>
    </div>
  );
};

export default Friend;
