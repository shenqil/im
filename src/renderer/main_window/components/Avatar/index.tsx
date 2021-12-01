import React from 'react';
import { selectFileServer } from '@renderer/main_window/store/domain';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import styles from './index.scss';
import defaultImg from '../../../public/img/avatar.png';
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
