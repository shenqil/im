import React, { FC, useEffect, useState } from 'react';
import { IMessage, EMsgType } from '@main/interface/msg';
import { useAppSelector } from '@renderer/main_window/store/hooks';
import { selectUserInfo } from '@renderer/main_window/store/user';
import Avatar from '@renderer/main_window/components/Avatar';
import TextMsg from '../TextMsg';
import './index.scss';

export interface IChatItemProps {
  msg:IMessage
}
const ChatItem:FC<IChatItemProps> = function (props) {
  const { msg } = props;
  const userInfo = useAppSelector(selectUserInfo);
  const [isSelf, setIsSelf] = useState<boolean>(false);

  useEffect(() => {
    if (!userInfo) {
      return;
    }
    if (userInfo.id === msg.formId) {
      setIsSelf(true);
    } else {
      setIsSelf(false);
    }
  }, [userInfo, msg]);

  return (
    <div className={`chat-item ${isSelf && 'chat-item--self'}`}>
      <div className="chat-item__avatar">
        <Avatar url={userInfo?.avatar || ''} />
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
