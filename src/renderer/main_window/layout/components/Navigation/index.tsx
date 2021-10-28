/* eslint-disable import/extensions */
import React from 'react';
import { connect } from 'react-redux';
import IStore, { INavigationState, INavigationItem } from '../../../store/interface';
import actions, { INavigationActions } from '../../../store/navigation/actions';
import styles from './index.scss';

interface IProps extends INavigationState, INavigationActions {
}

/**
 * 导航栏元素
 * */
function NavigationItem(props:{ navItem:INavigationItem, activa:INavigationItem | undefined }) {
  const { navItem, activa } = props;
  return (
    <div className={`${styles['nav-item']} ${activa && activa.key === navItem.key && styles['nav-item--activa']}`}>
      <i className={`iconfont ${navItem.icon}`} />
    </div>
  );
}

/**
 * 导航栏
 * */
function Navigation(props:IProps) {
  const { list: NavList, activa, changeActiva } = props;
  return (
    <div className={styles.navigation}>
      {/* 导航栏上半部分 */}
      <div className={styles['nav-list-top']}>
        {
          NavList.slice(0, NavList.length - 1)
            .map((item, index) => (
              <div
                key={item.key}
                role="button"
                tabIndex={index}
                onClick={() => changeActiva(item)}
                onKeyUp={() => {}}
              >
                <NavigationItem navItem={item} activa={activa} />
              </div>
            ))
        }
      </div>

      {/* 导航栏下半部分 */}
      <div className={styles['nav-list-bottom']}>
        {
          NavList.slice(-1)
            .map((item, index) => (
              <div
                key={item.key}
                role="button"
                tabIndex={index}
                onClick={() => changeActiva(item)}
                onKeyUp={() => {}}
              >
                <NavigationItem navItem={item} activa={activa} />
              </div>
            ))
        }
      </div>
    </div>
  );
}

const mapStateToPropsParam = (state:IStore) => state.navigation;
const mapDispatchToPropsParam = actions;

export default connect(mapStateToPropsParam, mapDispatchToPropsParam)(Navigation);
