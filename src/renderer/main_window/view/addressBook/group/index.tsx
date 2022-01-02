import React from 'react';
import { mainBridge } from '@renderer/public/ipcRenderer';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectGroupList } from '@renderer/main_window/store/group';
import type { IGroupInfo } from '@main/modules/mqtt/interface';
import Avatar from '@renderer/main_window/components/Avatar';
import styles from './index.scss';

interface IGroupItemProps {
  groupInfo:IGroupInfo
}
const GroupItem = function (props:IGroupItemProps) {
  const { groupInfo } = props;

  function handleClick() {
    mainBridge.server.conversationSrv.gotoConversation(groupInfo);
  }

  return (
    <div className={styles['group-item']} onClick={() => handleClick()} aria-hidden="true">
      <div className={styles['group-item__avatar']}>
        <Avatar url={groupInfo.avatar} />
      </div>

      <div className={styles['group-item__info']}>
        <div className={styles['group-item__info-title']}>
          {groupInfo.groupName}
        </div>

        <div className={styles['group-item__info-member']}>
          {groupInfo.memberIDs.length}
          人
        </div>
      </div>
    </div>
  );
};

const Group = function () {
  const groupList = useAppSelector(selectGroupList);

  function openAddGroupMemberWin() {
    mainBridge.wins.modal.showAddMember();
  }

  return (
    <div className={styles.group}>
      <div className={styles.group__header}>
        <div className={styles['group__header-title']}>
          我的群组
        </div>

        <i className={`iconfont icon-tianjiaqunzu-52 ${styles['group__header-add']}`} onClick={openAddGroupMemberWin} aria-hidden="true" />
      </div>

      <div className={`scroll ${styles.group__container}`}>
        {
          groupList.map((item) => (<GroupItem groupInfo={item} key={item.id} />))
        }
      </div>
    </div>
  );
};

export default Group;
