import React from 'react';
import styles from './index.scss';
import defaultImg from '../../../public/img/avatar.png';

/**
 * 头像
 * */
const Avatar = function ({ url }:{ url:string }) {
  return (
    <div className={styles.avatar}>
      <img src={url ? `http://localhost:8080/files/files/${url}` : defaultImg} alt="" className={styles.img} />
    </div>
  );
};

export default Avatar;
