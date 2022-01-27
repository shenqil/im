import React, { FC, useMemo } from 'react';
import { IMessage, EMsgType, ECharType } from '@main/interface/msg';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectFriendList } from '@renderer/main_window/store/friend';
import Avatar from '@renderer/main_window/components/Avatar';
import { IUserInfo } from '@main/modules/mqtt/interface';
import TextMsg from '../TextMsg';
import './index.scss';

export interface IChatItemProps {
  msg:IMessage,
  userInfo:IUserInfo,
}
const ChatItem:FC<IChatItemProps> = function (props) {
  const { msg, userInfo } = props;
  const friendList = useAppSelector(selectFriendList);
  const isSelf = userInfo.id === msg.formId;

  const avatar = useMemo(() => {
    if (userInfo.id === msg.formId) {
      return userInfo.avatar;
    }

    if (msg.charType === ECharType.single) {
      const friendInfo = friendList.find((item) => item.id === msg.formId);
      return friendInfo?.avatar || '';
    }

    return '';
  }, [friendList, userInfo, msg]);

  function getCardId() {
    if (userInfo.id === msg.toId) {
      return msg.formId;
    }

    return undefined;
  }

  return (
    <div className={`chat-item ${isSelf && 'chat-item--self'}`}>
      <div className="chat-item__avatar">
        <Avatar
          url={avatar}
          cardId={getCardId()}
        />
      </div>

      <div className="chat-item__content">
        {/* 文本消息 */}
        {
          msg.msgType === EMsgType.text
          && <TextMsg text={msg.payload as string} />
        }

      </div>
    </div>
  );
};

export default ChatItem;
