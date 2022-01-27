/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  FC, UIEvent, useEffect, useRef,
} from 'react';
import { useAppSelector, useAppDispatch } from '@renderer/main_window/store/hooks';
import {
  selectMsgListByCurConversation, loadMsgListAsync, EMsgLoadStatus,
} from '@renderer/main_window/store/msg';
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
  const chatBoxRef = useRef<HTMLDivElement>(null); // 定义编辑框的引用

  /**
   * 滚动到底部
   * */
  function scrollToBottom() {
    if (!chatBoxRef.current) {
      return;
    }
    const { scrollHeight, clientHeight } = chatBoxRef.current;
    chatBoxRef.current.scrollTop = scrollHeight - clientHeight;
  }

  /**
   * 获取消息状态
   * */
  function getLoadStatus() {
    if (loadStatus === EMsgLoadStatus.lodding) {
      return (
        <>
          <span className={styles['chat-box__tips-icon']}>
            <Space><LoadingOutlined /></Space>
          </span>
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
  async function loadMore() {
    if (
      !userInfo
      || loadStatus !== EMsgLoadStatus.none
      || !conversationId
    ) {
      return;
    }
    const id = mergeId(userInfo.id, conversationId);

    let time = Date.now();
    if (msgList.length) {
      const firstMsg = msgList[0];
      time = firstMsg.msgTime;
    }
    await dispatch(loadMsgListAsync({ id, time }));
  }

  /**
   * 监听滚动事件
   * */
  function onScroll(event:UIEvent<HTMLDivElement>) {
    const { scrollTop } = event.target as HTMLDivElement;

    if (scrollTop <= 5) {
      loadMore();
    }
  }

  async function init() {
    if (msgList.length < 10) {
      // 消息列表数量小于10，加载更多
      await loadMore();
    }
    scrollToBottom();
  }

  // 监听会话发生变化
  useEffect(() => {
    init();
  }, [conversationId]);

  return (
    <div
      ref={chatBoxRef}
      className={`scroll ${styles['chat-box']}`}
      onScroll={(e) => onScroll(e)}
    >
      {/* 状态tips */}
      {
          loadStatus !== EMsgLoadStatus.none
          && (
          <div className={styles['chat-box__tips']}>
            {getLoadStatus()}
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
