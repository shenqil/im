import React, { FC, useState, useEffect } from 'react';
import { IMessage, EMsgType, ECharType } from '@main/interface/msg';
import type { IUserBaseInfo } from '@main/modules/sqlite3/interface';
import type { IFriendInfo, IUserInfo } from '@main/modules/mqtt/interface';
import Avatar from '@renderer/main_window/components/Avatar';
import TextMsg from '../TextMsg';
import './index.scss';

export interface IChatItemProps {
  msg:IMessage,
  userInfo:IUserInfo,
  memberList:IUserBaseInfo[] | undefined,
  friendInfo:IFriendInfo | undefined,
}
const ChatItem:FC<IChatItemProps> = function (props) {
  const {
    msg, userInfo, memberList, friendInfo,
  } = props;
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    setAvatar('');
    setName('');
    if (userInfo.id === msg.formId) {
      setAvatar(userInfo.avatar);
      return;
    }

    if (msg.charType === ECharType.single) {
      setAvatar(friendInfo?.avatar || '');
      return;
    }

    if (msg.charType === ECharType.group) {
      const memberInfo = memberList?.find((item) => item.id === msg.formId);
      setAvatar(memberInfo?.avatar || '');
      setName(memberInfo?.realName || '');
    }
  }, [memberList, userInfo, msg, friendInfo?.avatar]);

  function getCardId() {
    if (userInfo.id !== msg.formId) {
      return msg.formId;
    }

    return undefined;
  }

  return (
    <div className={`chat-item ${userInfo.id === msg.formId && 'chat-item--self'}`}>
      {
        avatar && (
        <>
          <div className="chat-item__avatar">
            <Avatar
              url={avatar}
              cardId={getCardId()}
            />
          </div>
          <div className="chat-item__content">
            {/* 群成员名称 */}
            {
              name && (
              <div className="chat-item__content-name">
                {name}
              </div>
              )
            }

            {/* 文本消息 */}
            {msg.msgType === EMsgType.text
              && <TextMsg text={msg.payload as string} />}

          </div>
        </>
        )
      }
    </div>
  );
};

export default ChatItem;
