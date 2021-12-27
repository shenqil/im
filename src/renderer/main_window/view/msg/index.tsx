import React, { FC } from 'react';
import styles from './index.scss';
import Conversation from './conversation';

const Msg:FC = function () {
  return (
    <div className={styles.msg}>
      <div className={styles.msg__left}>
        <Conversation />
      </div>

      <div className={styles.msg__right}>
        右侧
      </div>
    </div>
  );
};

export default Msg;
