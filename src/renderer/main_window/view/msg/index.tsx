import React, { FC, useState, useEffect } from 'react';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectActivaConversation } from '@renderer/main_window/store/conversation';
import { selectGroupList } from '@renderer/main_window/store/group';
import { selectFriendList } from '@renderer/main_window/store/friend';
import type { IGroupInfo, IFriendInfo } from '@main/modules/mqtt/interface';
import styles from './index.scss';
import Conversation from './conversation';
import ConversationHeader from './conversationHeader';
import ChatBox from './chatBox';
import ChartInput from './chartInput';
import RightMenu from './rightMenu';

export enum EConversationType {
  single = 'SINGLE',
  group = 'GROUP',
}

const Msg:FC = function () {
  const conversationInfo = useAppSelector(selectActivaConversation);
  const groupList = useAppSelector(selectGroupList);
  const friendList = useAppSelector(selectFriendList);
  const [groupInfo, setGroupInfo] = useState<IGroupInfo | undefined>(undefined);
  const [friendInfo, setFriendInfo] = useState<IFriendInfo | undefined>(undefined);
  const [showRightMenu, setShowRightMenu] = useState<boolean>(false);

  useEffect(() => {
    setGroupInfo(undefined);
    setFriendInfo(undefined);
    if (conversationInfo?.type === EConversationType.group) {
      const info = groupList.find((item) => item.id === conversationInfo?.id);
      setGroupInfo(info);
    } else if (conversationInfo?.type === EConversationType.single) {
      const info = friendList.find((item) => item.id === conversationInfo?.id);
      setFriendInfo(info);
    }
  }, [conversationInfo, groupList, friendList]);

  function handleHideRightMenu() {
    setShowRightMenu(false);
  }

  useEffect(() => {
    window.addEventListener('click', handleHideRightMenu);
    return () => {
      window.removeEventListener('click', handleHideRightMenu);
    };
  }, []);

  return (
    <div className={styles.msg}>
      <div className={styles.msg__left}>
        {/* 会话列表 */}
        <Conversation />
      </div>

      <div className={styles.msg__right}>
        {/* 展示区 */}
        {
          conversationInfo
          && (
            <>
              <div className={styles['msg__right-head']}>
                {/* 顶部 */}
                <ConversationHeader
                  conversationInfo={conversationInfo}
                  groupInfo={groupInfo}
                  handleRightMenu={() => setShowRightMenu(!showRightMenu)}
                />
              </div>
              <div className={styles['msg__right-box']}>
                {/* 滚动区 */}
                <ChatBox />
              </div>
              <div className={styles['msg__right-input']}>
                {/* 输入框 */}
                <ChartInput />
              </div>
            </>
          )
        }
      </div>

      {
        (showRightMenu && conversationInfo) && (
          <RightMenu
            groupInfo={groupInfo}
            friendInfo={friendInfo}
            conversationInfo={conversationInfo}
            handleRightMenu={() => setShowRightMenu(!showRightMenu)}
          />
        )
      }

    </div>
  );
};

export default Msg;
