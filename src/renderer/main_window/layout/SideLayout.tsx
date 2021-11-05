import React, { FC } from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';
import { connect } from 'react-redux';
import IStore, { IUserInfoState, IDomainState } from '@renderer/main_window/store/interface';
import actions, { IUserInfoActions } from '../store/userInfo/actions';
import styles from './sideLayout.scss';
import Navigation from './components/Navigation/index';
import Avatar from '../components/Avatar/index';

interface IProps extends RouteConfigComponentProps, IUserInfoState, IDomainState, IUserInfoActions {

}

const SideLayout:FC<IProps> = (props) => {
  const {
    route, fetchUserInfo, userInfo, fileServer,
  } = props;

  if (!userInfo) {
    fetchUserInfo();
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

const mapStateToPropsParam = (state:IStore) => ({
  ...state.userInfo,
  ...state.domain,
});
const mapDispatchToPropsParam = actions;

export default connect(mapStateToPropsParam, mapDispatchToPropsParam)(SideLayout);
