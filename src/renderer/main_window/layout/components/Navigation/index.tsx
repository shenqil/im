/* eslint-disable import/extensions */
import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styles from './index.scss';

interface INavItem {
  key:string,
  name:string,
  path:string,
  icon:string,
  unreadCount?:number,
}

interface IProps extends RouteComponentProps {
}

/**
 * 导航栏元素
 * */
const NavigationItem = function (props:{ navItem:INavItem, activa:string }) {
  const { navItem, activa } = props;

  function isActiva(path:string) {
    if (path && path !== '/') {
      return activa.indexOf(path) === 0;
    }

    return activa === path;
  }

  return (
    <div className={`${styles['nav-item']} ${isActiva(navItem.path) && styles['nav-item--activa']}`}>
      <i className={`iconfont ${navItem.icon}`} />
    </div>
  );
};

/**
 * 导航栏
 * */
const Navigation = function (props:IProps) {
  const { history } = props;

  const navList : Array<INavItem> = [
    {
      name: '消息',
      path: '/',
      key: 'msg',
      icon: 'icon-xiaoxi',
      unreadCount: 0,
    },
    {
      name: '通讯录',
      path: '/addressBook',
      key: 'addressBook',
      icon: 'icon-tongxunlu',
      unreadCount: 0,
    },
    {
      name: '设置',
      path: '',
      key: 'seting',
      icon: 'icon-gengduo',
      unreadCount: 0,
    },
  ];

  /**
   * 选中的导航栏发生变化
   * */
  function handleActiva(item:INavItem) {
    if (item.path && item.path !== history.location.pathname) {
      history.replace(item.path);
    }
  }

  return (
    <div className={styles.navigation}>
      {/* 导航栏上半部分 */}
      <div className={styles['nav-list-top']}>
        {
          navList.slice(0, navList.length - 1)
            .map((item, index) => (
              <div
                key={item.key}
                role="button"
                tabIndex={index}
                onClick={() => handleActiva(item)}
                onKeyUp={() => {}}
              >
                <NavigationItem navItem={item} activa={history.location.pathname} />
              </div>
            ))
        }
      </div>

      {/* 导航栏下半部分 */}
      <div className={styles['nav-list-bottom']}>
        {
          navList.slice(-1)
            .map((item, index) => (
              <div
                key={item.key}
                role="button"
                tabIndex={index}
              >
                <NavigationItem navItem={item} activa={history.location.pathname} />
              </div>
            ))
        }
      </div>
    </div>
  );
};

export default withRouter(Navigation);
