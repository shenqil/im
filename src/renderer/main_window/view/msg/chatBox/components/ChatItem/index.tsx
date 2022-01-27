import React, { FC } from 'react';
import { IMessage, EMsgType } from '@main/interface/msg';
import Avatar from '@renderer/main_window/components/Avatar';
import { IUserInfo } from '@main/modules/mqtt/interface';
import TextMsg from '../TextMsg';
import './index.scss';

export interface IChatItemProps {
  msg:IMessage,
  userInfo:IUserInfo
}
const ChatItem:FC<IChatItemProps> = function (props) {
  const { msg, userInfo } = props;

  return (
    <div className={`chat-item ${userInfo.id === msg.formId && 'chat-item--self'}`}>
      <div className="chat-item__avatar">
        <Avatar url={userInfo.avatar || ''} />
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
