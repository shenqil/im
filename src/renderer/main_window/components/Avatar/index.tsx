import React from 'react';
import { selectFileServer } from '@renderer/main_window/store/config';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import defaultImg from '@renderer/public/img/avatar.png';
import styles from './index.scss';
/**
 * 头像
 * */
const Avatar = function ({ url }:{ url:string }) {
  const fileServer = useAppSelector(selectFileServer);
  return (
    <div className={styles.avatar}>
      <img src={url ? `${fileServer}${url}` : defaultImg} alt="" className={styles.img} />
    </div>
  );
};

export default Avatar;
