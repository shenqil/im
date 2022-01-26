import React from 'react';
import { mainBridge } from '@renderer/public/ipcRenderer';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectGroupedFriendList } from '@renderer/main_window/store/friend';
import type { IFriendInfo } from '@main/modules/mqtt/interface';
import FriendItem from '../components/FriendItem';
import styles from './index.modules.scss';

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
        {groupItem.list.map((item) => (
          <div
            key={item.id}
            className={styles['friend-group-item__container-item']}
          >
            <FriendItem friendInfo={item} isRightMenu />
          </div>
        ))}
      </div>
    </div>
  );
};

const Friend = function () {
  const friendList = useAppSelector(selectGroupedFriendList);

  function openAddFriendWin() {
    mainBridge.wins.modal.showAddFriend();
  }

  return (
    <div className={styles.friend}>
      <div className={styles.friend__header}>
        <div className={styles['friend__header-title']}>
          我的好友
        </div>

        <i className={`iconfont icon-tianjiahaoyou ${styles['friend__header-add']}`} onClick={openAddFriendWin} aria-hidden="true" />
      </div>

      <div className={`scroll ${styles.friend__container}`}>
        {
          friendList.map((item) => (<FriendGroupItem groupItem={item} key={item.pinyin} />))
        }
      </div>
    </div>
  );
};

export default Friend;
