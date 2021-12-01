import React from 'react';
import { mainBridge } from '@renderer/public/ipcRenderer';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectGroupedFriendList } from '@renderer/main_window/store/friend';
import { IFriendInfo } from '@main/modules/mqtt/interface';
import Avatar from '@renderer/main_window/components/Avatar';
import styles from './index.scss';

interface IFriendItem {
  friendInfo:IFriendInfo
}
const FriendItem = function (props:IFriendItem) {
  const { friendInfo } = props;
  return (
    <div className={styles['friend-item']}>
      <div className={styles['friend-item__avatar']}>
        <Avatar url={friendInfo.avatar} />
      </div>

      <div className={styles['friend-item__info']}>
        <div className={styles['friend-item__info-real-name']}>
          {friendInfo.realName}
        </div>
        <div className={styles['friend-item__info-nick-name']}>
          {friendInfo.userName}
        </div>
      </div>
    </div>
  );
};

interface IFriendGroupItemProps {
  groupItem:{ pinyin:string, list:Array<IFriendInfo> }
}
const FriendGroupItem = function (props:IFriendGroupItemProps) {
  const { groupItem } = props;
  return (
    <div className={styles['friend-group-item']}>
      <div className={styles['friend-group-item__title']}>
        {groupItem.pinyin}
      </div>

      <div className={styles['friend-group-item__container']}>
        {groupItem.list.map((item) => (<FriendItem friendInfo={item} key={item.id} />))}
      </div>
    </div>
  );
};

const Friend = function () {
  const friendList = useAppSelector(selectGroupedFriendList);

  function openAddFriendWin() {
    mainBridge.wins.addFriend.openWin();
  }

  return (
    <div className={styles.friend}>
      <div className={styles.friend__header}>
        <div className={styles['friend__header-title']}>
          我的好友
        </div>

        <i className={`iconfont icon-tianjiahaoyou ${styles['friend__header-add']}`} onClick={openAddFriendWin} aria-hidden="true" />
      </div>

      <div className={styles.friend__container}>
        {
          friendList.map((item) => (<FriendGroupItem groupItem={item} key={item.pinyin} />))
        }
      </div>
    </div>
  );
};

export default Friend;
