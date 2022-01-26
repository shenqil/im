import React, { useState, useEffect } from 'react';
import { mainBridge, mainEvent, EMainEventKey } from '@renderer/public/ipcRenderer';
import { IFriendInfoSrv } from '@main/server/interface';
import defaultImg from '@renderer/public/img/avatar.png';

import styles from './index.modules.scss';

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
  const [fileServer] = useState(window.domainConfig.fileServer);
  const [isSelf, setIsSelf] = useState(false);

  async function init() {
    const cardId = await mainBridge.wins.modal.getCardId();
    const friendList = await mainBridge.server.friendSrv.getMyFriendList();
    const infos = await mainBridge.server.userSrv.getCacheUserInfo([cardId], true);
    const userInfo = await mainBridge.server.userSrv.getUserInfo();

    if (!infos.length) {
      return;
    }

    const info = infos[0];
    const isFriend = friendList.findIndex((item) => item.id === info.id) !== -1;

    setCardInfo({
      ...info,
      isFriend,
    });

    if (userInfo.id === info.id) {
      setIsSelf(true);
    }
  }

  useEffect(() => {
    init();
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

  async function gotoConversation() {
    await mainBridge.server.conversationSrv.gotoConversation(cardInfo);
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
        <img src={cardInfo.avatar ? `${fileServer}${cardInfo.avatar}` : defaultImg} alt="" className={styles['business-card__top-avatar']} />
      </div>

      <div className={styles['business-card__conainer']}>
        <BusinessCardItem label="手机号" content={cardInfo.phone} />
        <BusinessCardItem label="邮 箱 " content={cardInfo.email} />
      </div>

      <div className={styles['business-card__footer']}>
        {cardInfo.isFriend || isSelf
          ? (
            <>
              <i className={`iconfont icon-hanhan-01-01 ${styles['business-card__footer-icon']}`} />
              <i className={`iconfont icon-xiaoxi ${styles['business-card__footer-icon']}`} onClick={() => gotoConversation()} aria-hidden="true" />
            </>
          )
          : (<i className={`iconfont icon-tianjiahaoyou1 ${styles['business-card__footer-icon']}`} onClick={() => addFriend()} aria-hidden="true" />)}

      </div>
    </div>
  );
};

export default BusinessCard;
