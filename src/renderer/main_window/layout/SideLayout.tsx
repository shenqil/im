import React, { FC } from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import styles from './sideLayout.scss';
import Navigation from './components/Navigation/index';
import Avatar from '../components/Avatar/index';

interface IProps extends RouteConfigComponentProps {

}

const SideLayout:FC<IProps> = ({ route }) => (
  <div className={styles['side-layout']}>
    {/* 侧边导航 */}
    <div className={styles.navigation}>
      <div className={styles.avatar}>
        <Avatar />
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

export default SideLayout;
