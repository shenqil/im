import React, { FC, useState, useEffect } from 'react';
import type { IConversationInfo } from '@main/modules/sqlite3/interface';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectGroupList } from '@renderer/main_window/store/group';
import { IGroupInfo } from '@main/modules/mqtt/interface';
import styles from './index.scss';

interface IConversationHeaderProps {
  conversationInfo:IConversationInfo
}
const ConversationHeader:FC<IConversationHeaderProps> = function (props) {
  const { conversationInfo } = props;
  const groupList = useAppSelector(selectGroupList);
  const [groupInfo, setGroupInfo] = useState<IGroupInfo | undefined>(undefined);

  useEffect(() => {
    const info = groupList.find((item) => item.id === conversationInfo.id);
    setGroupInfo(info);
  }, [conversationInfo, groupList]);

  return (
    <div className={styles['conversation-header']}>
      <div className={styles['conversation-header__left']}>
        <div className={styles['conversation-header__left-name']}>
          <div className={styles['conversation-header__left-name-text']}>
            {conversationInfo.name}
          </div>
        </div>
        {
          groupInfo
          && (
            <div className={styles['conversation-header__left-num']}>
              (
              {groupInfo.memberIDs.length}
              )
            </div>
          )
        }
      </div>
      <div className={styles['conversation-header__right']}>
        <i className="icon-qita iconfont" />
      </div>
    </div>
  );
};

export default ConversationHeader;
