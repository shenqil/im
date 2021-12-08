import React, { useState, useEffect } from 'react';
import { mainBridge, mainEvent, EMainEventKey } from '@renderer/public/ipcRenderer';
import { IFriendInfoSrv } from '@main/server/interface';
import defaultImg from '@renderer/public/img/avatar.png';

import styles from './index.scss';

const BusinessCardItem = function (props: { label: string; content: string; }) {
  const { label, content } = props;
  return (
    <div className={styles['business-card__conainer-item']}>
      <div className={styles['business-card__conainer-label']}>
        {label}
      </div>

      <div className={styles['business-card__conainer-content']}>
        {content}
      </div>
    </div>
  );
};

const BusinessCard = function () {
  const [cardInfo, setCardInfo] = useState<IFriendInfoSrv>({
    id: '',
    avatar: '',
    userName: '',
    realName: '',
    phone: '',
    email: '',
    isFriend: false,
  });

  useEffect(() => {
    mainBridge.wins.modal.getFriendInfo()
      .then((res) => {
        setCardInfo(res);
      });
  }, []);

  async function addFriend() {
    try {
      await mainBridge.server.friendSrv.add(cardInfo.id);
      mainEvent.emit(EMainEventKey.UnifiedPrompt, {
        type: 'success',
        msg: '发送成功',
      });
    } catch (error) {
      mainEvent.emit(EMainEventKey.UnifiedPrompt, {
        type: 'error',
        msg: `${error}`,
      });
    }

    mainBridge.wins.modal.hidden();
  }

  return (
    <div className={styles['business-card']}>
      <div className={styles['business-card__top']}>
        <div className={styles['business-card__top-left']}>
          <div className={styles['business-card__top-name']}>
            {cardInfo.realName}
          </div>

          <div className={styles['business-card__top-account']}>
            账号:
            {cardInfo.userName}
          </div>
        </div>
        <img src={cardInfo.avatar ? `http://localhost:8080/files/files/${cardInfo.avatar}` : defaultImg} alt="" className={styles['business-card__top-avatar']} />
      </div>

      <div className={styles['business-card__conainer']}>
        <BusinessCardItem label="手机号" content={cardInfo.phone} />
        <BusinessCardItem label="邮 箱 " content={cardInfo.email} />
      </div>

      <div className={styles['business-card__footer']}>
        {cardInfo.isFriend
          ? (
            <>
              <i className={`iconfont icon-hanhan-01-01 ${styles['business-card__footer-icon']}`} />
              <i className={`iconfont icon-xiaoxi ${styles['business-card__footer-icon']}`} />
            </>
          )
          : (<i className={`iconfont icon-tianjiahaoyou1 ${styles['business-card__footer-icon']}`} onClick={() => addFriend()} aria-hidden="true" />)}

      </div>
    </div>
  );
};

export default BusinessCard;
