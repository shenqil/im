import React, { FC } from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { useAppSelector, useAppDispatch } from '@renderer/main_window/store/hooks';
import { selectUserInfo, fetchUserInfoAsync } from '@renderer/main_window/store/user';
import { selectFileServer } from '@renderer/main_window/store/domain';
import styles from './sideLayout.scss';
import Navigation from './components/Navigation';
import Avatar from '../components/Avatar';

interface IProps extends RouteConfigComponentProps{

}

const SideLayout:FC<IProps> = function (props) {
  const {
    route,
  } = props;

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
        {route && renderRoutes(route.routes)}
      </div>
    </div>
  );
};

export default SideLayout;
