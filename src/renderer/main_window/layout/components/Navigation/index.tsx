import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@renderer/main_window/store/hooks';
import {
  selectNavigationActiva, selectNavigationList, changeActiva, INavigationItem,
} from '@renderer/main_window/store/navigation';
import styles from './index.scss';

/**
 * 导航栏元素
 * */
const NavigationItem = function (props:{ navItem:INavigationItem, activa:string }) {
  const { navItem, activa } = props;

  return (
    <div className={`${styles['nav-item']} ${navItem.key === activa && styles['nav-item--activa']}`}>
      <i className={`iconfont ${navItem.icon}`} />
    </div>
  );
};

/**
 * 导航栏
 * */
const Navigation = function () {
  const navList = useAppSelector(selectNavigationList);
  const navActiva = useAppSelector(selectNavigationActiva);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(navActiva.path);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navActiva]);

  /**
   * 选中的导航栏发生变化
   * */
  function handleActiva(item:INavigationItem) {
    if (item.key !== navActiva.key) {
      dispatch(changeActiva(item));
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
                <NavigationItem navItem={item} activa={navActiva.key} />
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
                <NavigationItem navItem={item} activa={navActiva.key} />
              </div>
            ))
        }
      </div>
    </div>
  );
};

export default Navigation;
