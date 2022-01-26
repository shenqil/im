import React from 'react';
import styles from './index.modules.scss';

export enum EActiva {
  frequentContacts = 'FREQUENT_CONTACTS',
  newFriend = 'NEW_FRIEND',
  friend = 'FRIEND',
  group = 'GROUP',
}

interface INavItem {
  name:string,
  key: EActiva,
  icon: string,
  unreadCount: number,
}

interface IProps{
  activa:EActiva,
  handleActiva(activa:EActiva):void
}

const SideBarItem = function (props:{ navItem:INavItem, isActiva:boolean }) {
  const { navItem, isActiva } = props;

  return (
    <div className={`${styles['side-bar-item']} ${isActiva && styles['side-bar-item--activa']}`}>
      <div className={styles['side-bar-item__icon']}>
        <i className={`iconfont ${navItem.icon} ${styles['side-bar-item__icon-font']}`} />
      </div>
      <div className={styles['side-bar-item__name']}>
        {navItem.name}
      </div>
    </div>
  );
};

const SideBar = function (props:IProps) {
  const { activa, handleActiva } = props;

  const navList:Array<INavItem> = [
    {
      name: '常用联系人',
      key: EActiva.frequentContacts,
      icon: 'icon-changyonglianxiren1',
      unreadCount: 0,
    },
    {
      name: '新的好友',
      key: EActiva.newFriend,
      icon: 'icon-xindehaoyou',
      unreadCount: 0,
    },
    {
      name: '我的好友',
      key: EActiva.friend,
      icon: 'icon-wodehaoyou',
      unreadCount: 0,
    },
    {
      name: '我的群组',
      key: EActiva.group,
      icon: 'icon-wodequnzu',
      unreadCount: 0,
    },
  ];

  return (
    <div className={styles['side-bar']}>
      <div className={styles['side-bar__title']}>
        通讯录
      </div>
      <div>
        {
        navList.map((item, index) => (
          <div
            key={item.key}
            role="button"
            tabIndex={index}
            onClick={() => handleActiva(item.key)}
            onKeyUp={() => {}}
          >
            <SideBarItem
              navItem={item}
              isActiva={activa === item.key}
            />
          </div>
        ))
      }
      </div>

    </div>
  );
};

export default SideBar;
