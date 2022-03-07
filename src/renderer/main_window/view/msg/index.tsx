import React, { FC, useState, useEffect } from 'react';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectActivaConversation } from '@renderer/main_window/store/conversation';
import { selectGroupList } from '@renderer/main_window/store/group';
import { selectFriendList } from '@renderer/main_window/store/friend';
import { selectUserInfo } from '@renderer/main_window/store/user';
import type { IGroupInfo, IFriendInfo } from '@main/modules/mqtt/interface';
import type { IUserBaseInfo } from '@main/modules/sqlite3/interface';
import { EConversationType } from '@main/modules/sqlite3/enum';
import { mainBridge } from '@renderer/public/ipcRenderer';
import { message } from 'antd';
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
  const [memberList, setMemberList] = useState<IUserBaseInfo[]>([]);

  // 得到当前聊天的对象
  useEffect(() => {
    setFriendInfo(undefined);
    if (conversationInfo?.type === EConversationType.single) {
      const info = friendList.find((item) => item.id === conversationInfo?.id);
      setFriendInfo(info);
    }
  }, [conversationInfo, groupList, friendList]);

  // 得到当前聊天的群组和群成员
  useEffect(() => {
    setGroupInfo(undefined);
    if (conversationInfo?.type === EConversationType.group) {
      const info = groupList.find((item) => item.id === conversationInfo?.id);
      setGroupInfo(info);
      const ids = info?.memberIDs;
      if (ids && ids.length) {
        mainBridge.server.userSrv.getCacheUserInfo(ids)
          .then((list) => {
            setMemberList(list);
          })
          .catch((err) => {
            console.error(err);
            message.error('群成员信息获取失败!');
          });
      }
    } else {
      setMemberList([]);
    }
  }, [conversationInfo, groupList]);

  return (
    <div className={styles.msg}>
      <div className={styles.msg__left}>
        {/* 会话列表 */}
        <Conversation />
      </div>

      <div className={styles.msg__right}>
        {/* 展示区 */}
        {
          conversationInfo && userInfo && (groupInfo || friendInfo)
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
                  groupInfo={groupInfo}
                  memberList={memberList}
                  friendInfo={friendInfo}
                  conversationInfo={conversationInfo}
                />
              </div>
              <div className={styles['msg__right-input']}>
                {/* 输入框 */}
                <ChartInput
                  userInfo={userInfo}
                  groupInfo={groupInfo}
                  memberList={memberList}
                  friendInfo={friendInfo}
                  conversationInfo={conversationInfo}
                />
              </div>
            </>
          )
        }
      </div>

      {
        (showRightMenu && conversationInfo && (groupInfo || friendInfo)) && (
          <RightMenu
            userInfo={userInfo}
            groupInfo={groupInfo}
            memberList={memberList}
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
