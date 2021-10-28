import React from 'react';
import styles from './index.scss';
import defaultImg from '../../../public/img/avatar.png';

/**
 * 头像
 * */
function Avatar() {
  return (
    <div className={styles.avatar}>
      <img src={defaultImg} alt="" className={styles.img} />
    </div>
  );
}

export default Avatar;
