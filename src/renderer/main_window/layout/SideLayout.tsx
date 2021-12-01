import React from 'react';

import { Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@renderer/main_window/store/hooks';
import { selectUserInfo, fetchUserInfoAsync } from '@renderer/main_window/store/user';
import Navigation from './components/Navigation';
import Avatar from '../components/Avatar';
import styles from './sideLayout.scss';

const SideLayout = function () {
  const userInfo = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();

  if (!userInfo) {
    dispatch(fetchUserInfoAsync());
  }

  return (
    <div className={styles['side-layout']}>
      {/* 侧边导航 */}
      <div className={styles.navigation}>
        <div className={styles.avatar}>
          <Avatar url={userInfo?.avatar || ''} />
        </div>

        <div className={styles.content}>
          <Navigation />
        </div>

      </div>
      {/* 内容区 */}
      <div className={styles.container}>
        <Outlet />
      </div>
    </div>
  );
};

export default SideLayout;
