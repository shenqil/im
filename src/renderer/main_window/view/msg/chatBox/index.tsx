/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, UIEvent, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@renderer/main_window/store/hooks';
import { selectMsgListByCurConversation, loadMsgListAsync, EMsgLoadStatus } from '@renderer/main_window/store/msg';
import { selectUserInfo } from '@renderer/main_window/store/user';
import { selectActivaId } from '@renderer/main_window/store/conversation';
import { mergeId } from '@renderer/public/utils/common';
import { LoadingOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import ChatItem from './components/ChatItem';
import styles from './index.modules.scss';

const ChatBox:FC = function () {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(selectUserInfo);
  const conversationId = useAppSelector(selectActivaId);
  const { msgList, loadStatus } = useAppSelector(selectMsgListByCurConversation);

  function getStatusText() {
    if (loadStatus === EMsgLoadStatus.lodding) {
      return (
        <>
          <Space><LoadingOutlined /></Space>
          加载中...
        </>
      );
    }

    if (loadStatus === EMsgLoadStatus.finished) {
      return '无更多数据';
    }

    return '';
  }

  /**
   * 加载更多
   * */
  function loadMore() {
    if (
      !userInfo
      || loadStatus !== EMsgLoadStatus.none
      || !conversationId
    ) {
      return;
    }
    const id = mergeId(userInfo.id, conversationId);
    dispatch(loadMsgListAsync(id));
  }

  /**
   * 监听滚动事件
   * */
  function onScroll(event:UIEvent<HTMLDivElement>) {
    const { scrollHeight, clientHeight, scrollTop } = event.target as HTMLDivElement;
    console.log(scrollHeight, clientHeight, scrollTop);

    if (scrollTop <= 5) {
      // loadMore();
    }
  }

  // 监听会话发生变化
  useEffect(() => {
    if (msgList.length < 10) {
      // 消息列表数量小于10，加载更多
      loadMore();
    }
  }, [conversationId]);

  return (
    <div className={`scroll ${styles['chat-box']}`} onScroll={(e) => onScroll(e)}>

      {/* 状态tips */}
      {
          loadStatus !== EMsgLoadStatus.none
          && (
          <div className={styles['chat-box__tips']}>
            {getStatusText()}
          </div>
          )
      }

      {/* 主体内容 */}
      <div className={styles['chat-box__inner']}>
        {msgList && msgList.map(
          (item) => (
            <ChatItem
              key={item.msgId}
              msg={item}
            />
          ),
        )}
      </div>
    </div>
  );
};

export default ChatBox;
