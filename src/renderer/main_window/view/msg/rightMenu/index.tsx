import React, { FC } from 'react';
import type { IGroupInfo, IFriendInfo } from '@main/modules/mqtt/interface';
import styles from './index.scss';

interface IRightMenuProps {
  groupInfo:IGroupInfo | undefined,
  friendInfo:IFriendInfo | undefined
}
const RightMenu:FC<IRightMenuProps> = function (props) {
  const { groupInfo, friendInfo } = props;
  console.log(groupInfo, friendInfo, 'props');
  return (
    <div
      className={styles['right-menu']}
      onClick={(e) => e.stopPropagation()}
      aria-hidden="true"
    >
      RightMenu
    </div>
  );
};

export default RightMenu;
