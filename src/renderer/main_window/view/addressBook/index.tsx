import React, { useState } from 'react';
import FrequentContacts from '@renderer/main_window/view/addressBook/frequentContacts';
import NewFriend from '@renderer/main_window/view/addressBook/newFriend';
import Friend from '@renderer/main_window/view/addressBook/friend';
import Group from '@renderer/main_window/view/addressBook/group';
import SideBar, { EActiva } from './components/SideBar';
import styles from './index.scss';

const AddressBook = function () {
  const [activa, setActiva] = useState(EActiva.frequentContacts);

  return (
    <div className={styles['address-book']}>
      <div className={styles['address-book__left']}>
        <SideBar activa={activa} handleActiva={setActiva} />
      </div>
      <div className={styles['address-book__right']}>
        {activa === EActiva.frequentContacts && <FrequentContacts />}
        {activa === EActiva.newFriend && <NewFriend />}
        {activa === EActiva.friend && <Friend />}
        {activa === EActiva.group && <Group />}
      </div>
    </div>
  );
};

export default AddressBook;
