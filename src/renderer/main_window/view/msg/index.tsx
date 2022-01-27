import React, { FC, useState, useEffect } from 'react';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectActivaConversation } from '@renderer/main_window/store/conversation';
import { selectGroupList } from '@renderer/main_window/store/group';
import { selectFriendList } from '@renderer/main_window/store/friend';
import { selectUserInfo } from '@renderer/main_window/store/user';
import type { IGroupInfo, IFriendInfo } from '@main/modules/mqtt/interface';
import { EConversationType } from '@main/modules/sqlite3/enum';
import Conversation from './conversation';
import ConversationHeader from './conversationHeader';
import ChatBox from './chatBox';
import ChartInput from './chartInput';
import RightMenu from './rightMenu';
import styles from './index.modules.scss';

const Msg:FC = function () {
  const userInfo = useAppSelector(selectUserInfo);
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

  return (
    <div className={styles.msg}>
      <div className={styles.msg__left}>
        {/* 会话列表 */}
        <Conversation />
      </div>

      <div className={styles.msg__right}>
        {/* 展示区 */}
        {
          conversationInfo && userInfo
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
                <ChatBox
                  userInfo={userInfo}
                />
              </div>
              <div className={styles['msg__right-input']}>
                {/* 输入框 */}
                <ChartInput
                  userInfo={userInfo}
                  groupInfo={groupInfo}
                  friendInfo={friendInfo}
                  conversationInfo={conversationInfo}
                />
              </div>
            </>
          )
        }
      </div>

      {
        (showRightMenu && conversationInfo) && (
          <RightMenu
            userInfo={userInfo}
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
