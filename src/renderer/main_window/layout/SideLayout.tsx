import React, { FC } from 'react';
import Msg from '@renderer/main_window/view/msg';
import AddressBook from '@renderer/main_window/view/addressBook';
import { Route } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@renderer/main_window/store/hooks';
import { selectUserInfo, fetchUserInfoAsync } from '@renderer/main_window/store/user';
import { selectFileServer } from '@renderer/main_window/store/domain';
import Navigation from './components/Navigation';
import Avatar from '../components/Avatar';
import styles from './sideLayout.scss';

const SideLayout:FC = function () {
  const userInfo = useAppSelector(selectUserInfo);
  const fileServer = useAppSelector(selectFileServer);
  const dispatch = useAppDispatch();

  if (!userInfo) {
    dispatch(fetchUserInfoAsync());
  }

  let avatar = '';
  if (userInfo?.avatar && fileServer) {
    avatar = `${fileServer}${userInfo.avatar}`;
  }

  return (
    <div className={styles['side-layout']}>
      {/* 侧边导航 */}
      <div className={styles.navigation}>
        <div className={styles.avatar}>
          <Avatar url={avatar} />
        </div>

        <div className={styles.content}>
          <Navigation />
        </div>

      </div>
      {/* 内容区 */}
      <div className={styles.container}>
        <Route path="/" exact component={Msg} />
        <Route path="/addressBook" component={AddressBook} />
      </div>
    </div>
  );
};

export default SideLayout;
