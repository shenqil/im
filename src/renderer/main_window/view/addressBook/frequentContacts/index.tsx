import React from 'react';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectFrequentContacts } from '@renderer/main_window/store/friend';
import FriendItem from '../components/FriendItem';
import styles from './index.scss';

const FrequentContacts = function () {
  const friendList = useAppSelector(selectFrequentContacts);

  return (
    <div className={styles['frequent-contacts']}>
      <div className={styles['frequent-contacts__header']}>
        常用联系人
      </div>

      <div className={`scroll ${styles['frequent-contacts__container']}`}>
        {
          friendList.map((item) => (
            <div key={item.id} className={styles['frequent-contacts__container-item']}>
              <FriendItem friendInfo={item} isFriend isRightMenu />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default FrequentContacts;
