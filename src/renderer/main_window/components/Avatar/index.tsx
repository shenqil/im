import React from 'react';
import { mainBridge } from '@renderer/public/ipcRenderer';
import { selectFileServer } from '@renderer/main_window/store/config';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import defaultImg from '@renderer/public/img/avatar.png';
import styles from './index.modules.scss';
/**
 * 头像
 * */
export interface IAvatar{
  url:string,
  cardId?:string
}
const Avatar = function ({ url, cardId }:IAvatar) {
  const fileServer = useAppSelector(selectFileServer);

  function showBusinessCard(isCursorPoint = true) {
    if (cardId) {
      mainBridge.wins.modal.showBusinessCard({
        isCursorPoint,
        cardId,
      });
    }
  }

  return (
    <div
      className={styles.avatar}
      onClick={() => showBusinessCard()}
      aria-hidden="true"
    >
      <img src={url ? `${fileServer}${url}` : defaultImg} alt="" className={styles.img} />
    </div>
  );
};

export default Avatar;
