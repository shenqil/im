/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMessage } from '@main/interface/msg';
import { mergeId } from '@renderer/public/utils/common';
import type { RootState } from '../index';

export interface IMsgState {
  msgMap:any // Object<string,IMessage[]>
}

const initialState:IMsgState = {
  msgMap: {},
};

export const msgSlice = createSlice({
  name: 'msg',
  initialState,
  reducers: {
    insert: (state, action:PayloadAction<IMessage>) => {
      const { msgMap } = state;
      const newMsg = action.payload;
      const { id } = newMsg;
      const msgList = (msgMap[id] || []) as Array<IMessage>;

      // 去重
      const i = msgList.findIndex((msgItem) => msgItem.msgId === newMsg.msgId);
      if (i !== -1) {
        return;
      }

      // 反向查找插入
      let isInsert = false;
      for (let index = msgList.length - 1; index >= 0; index--) {
        const msgItem = msgList[index];
        if (newMsg.msgTime >= msgItem.msgTime) {
          msgList.splice(index + 1, 0, newMsg); // 插入大于此消息的后面
          isInsert = true;
          break;
        }
      }
      if (!isInsert) {
        msgList.unshift(newMsg);
      }

      // 更新
      msgMap[id] = msgList;

      state.msgMap = { ...msgMap };
    },
    update: (state, action:PayloadAction<IMessage>) => {
      const { msgMap } = state;
      const newMsg = action.payload;
      const { id } = newMsg;
      const msgList = (msgMap[id] || []) as Array<IMessage>;

      const index = msgList.findIndex((msgItem) => msgItem.msgId === newMsg.msgId);
      if (index === -1) {
        // 不存在，不用更新
        return;
      }

      const msgItem = msgList[index];
      if (msgItem.msgTime >= newMsg.msgTime) {
        // 时间不新，不用更新
        return;
      }

      // 更新
      msgList[index] = newMsg;

      state.msgMap = { ...msgMap };
    },
  },
});

export const {
  insert,
  update,
} = msgSlice.actions;

// 当前会话的消息列表
export const selectMsgListByCurConversation = (state:RootState) => {
  const conversationId = state.conversation.activaId;
  const { userId } = state.user;
  if (!userId || !conversationId) {
    return [];
  }
  const id = mergeId(conversationId, userId);

  return (state.msg.msgMap[id] || []) as Array<IMessage>;
};

export default msgSlice.reducer;
