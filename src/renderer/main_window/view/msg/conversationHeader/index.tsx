import React, { FC } from 'react';
import type { IConversationInfo } from '@main/modules/sqlite3/interface';
import type { IGroupInfo } from '@main/modules/mqtt/interface';
import styles from './index.modules.scss';

interface IConversationHeaderProps {
  conversationInfo:IConversationInfo
  groupInfo:IGroupInfo | undefined
  handleRightMenu:Function
}
const ConversationHeader:FC<IConversationHeaderProps> = function (props) {
  const { conversationInfo, groupInfo, handleRightMenu } = props;

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
      <div
        className={styles['conversation-header__right']}
        onClick={(e) => {
          e.stopPropagation();
          handleRightMenu();
        }}
        aria-hidden="true"
      >
        <i className="icon-qita iconfont" />
      </div>
    </div>
  );
};

export default ConversationHeader;
