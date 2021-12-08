import React from 'react';
import { mainBridge } from '@renderer/public/ipcRenderer';
import styles from './index.scss';

const Group = function () {
  function openAddGroupMemberWin() {
    mainBridge.wins.modal.showAddMember();
  }

  return (
    <div className={styles.group}>
      <div className={styles.group__header}>
        <div className={styles['group__header-title']}>
          我的群组
        </div>

        <i className={`iconfont icon-tianjiaqunzu-52 ${styles['group__header-add']}`} onClick={openAddGroupMemberWin} aria-hidden="true" />
      </div>

      <div className={`scroll ${styles.group__container}`}>
        group
      </div>
    </div>
  );
};

export default Group;
