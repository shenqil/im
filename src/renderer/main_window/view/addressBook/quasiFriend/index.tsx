import React, { useState } from 'react';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectQuasiFriendList } from '@renderer/main_window/store/friend';
import type { IQuasiFriendSrv } from '@main/server/interface';
import { message, Button } from 'antd';
import { mainBridge } from '@renderer/public/ipcRenderer';
import FriendItem from '../components/FriendItem';
import styles from './index.scss';

enum EFriendStatus {
  FriendSubscribe = 1,
  FriendUnsubscribe = 2,
  FriendRefuse = 3,
  FriendIgnore = 4,
  FriendNone = 0,
}

// 准好友操作状态
interface IQuasiFriendStatusProps{
  quasiFriend:IQuasiFriendSrv
}
const QuasiFriendStatus = function (props:IQuasiFriendStatusProps) {
  const { quasiFriend } = props;
  const { selfStatus, friendStatus, info } = quasiFriend;

  const [loading, setLoading] = useState(false);

  // 添加好友
  function handelAddFriend() {
    if (loading) {
      return;
    }
    setLoading(true);
    mainBridge.server.friendSrv.add(info.id)
      .then(() => {
        message.success('好友添加成功');
      })
      .catch((err) => {
        message.error(`${err}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function computed() {
    if (selfStatus !== EFriendStatus.FriendSubscribe
      && friendStatus === EFriendStatus.FriendSubscribe) {
      return <Button loading={loading} type="primary" size="small" onClick={() => handelAddFriend()}>同意</Button>;
    }

    if (selfStatus === EFriendStatus.FriendSubscribe
      && friendStatus === EFriendStatus.FriendUnsubscribe) {
      return <Button loading={loading} size="small" onClick={() => handelAddFriend()}>重新添加</Button>;
    }

    if (selfStatus === EFriendStatus.FriendSubscribe
      && friendStatus !== EFriendStatus.FriendSubscribe) {
      return <div className={styles['quasi-friend-status__label']}>请求中</div>;
    }

    return '';
  }

  return (
    <div className={styles['quasi-friend-status']}>

      {computed()}

    </div>
  );
};

// QuasiFriendItem 准好友Item
interface IQuasiFriendItemProps {
  quasiFriend:IQuasiFriendSrv
}
const QuasiFriendItem = function (props:IQuasiFriendItemProps) {
  const { quasiFriend } = props;

  return (
    <div className={styles['quasi-friend-item']}>
      <div className={styles['quasi-friend-item__info']}>
        <FriendItem friendInfo={quasiFriend.info} />
      </div>

      <div className={styles['quasi-friend-item__action']}>
        <QuasiFriendStatus
          quasiFriend={quasiFriend}
        />
      </div>
    </div>
  );
};

// QuasiFriend 准好友列表
const QuasiFriend = function () {
  const quasiFriendList = useAppSelector(selectQuasiFriendList);

  return (
    <div className={styles['quasi-friend']}>
      <div className={styles['quasi-friend__header']}>
        新的好友
      </div>
      <div className={styles['quasi-friend__container']}>
        {quasiFriendList
          .filter((item) => item.selfStatus !== EFriendStatus.FriendIgnore)
          .map((item) => (<QuasiFriendItem quasiFriend={item} key={item.info.id} />))}
      </div>
    </div>
  );
};

export default QuasiFriend;
