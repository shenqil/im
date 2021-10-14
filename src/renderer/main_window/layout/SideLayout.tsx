import React, { FC } from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import style from './sideLayout.scss';
import Navigation from './components/Navigation/index';

interface IProps extends RouteConfigComponentProps {

}

const SideLayout:FC<IProps> = ({ route }) => (
  <div className={style['side-layout']}>
    {/* 侧边导航 */}
    <div className={style.navigation}>
      <Navigation />
    </div>
    {/* 内容区 */}
    <div className={style.container}>
      {route && renderRoutes(route.routes)}
    </div>
  </div>
);

export default SideLayout;
