import React from 'react';
import { mainBridge } from '@renderer/public/ipcRenderer';
import styles from './index.scss';

const AddMember = function () {
  function handCancel() {
    mainBridge.wins.modal.hidden();
  }

  return (
    <div className={styles['add-member']}>
      <div className={styles['add-member__header']}>
        <i className={`iconfont icon-guanbi ${styles['add-member__header-icon']}`} onClick={() => handCancel()} aria-hidden="true" />
      </div>

      <div className={styles['add-member__container']}>
        <div className={styles['add-member__left']}>
          left
        </div>

        <div className={styles['add-member__right']}>
          right
        </div>
      </div>
    </div>
  );
};

export default AddMember;
