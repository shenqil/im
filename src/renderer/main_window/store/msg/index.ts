/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMessage } from '@main/interface/msg';
import { mergeId } from '@renderer/public/utils/common';
import { mainBridge } from '@renderer/public/ipcRenderer';
import type { RootState } from '../index';

export enum EMsgLoadStatus {
  none = 'NONE',
  lodding = 'LODDING',
  finished = 'FINISHED',
}

/**
 * 返回一个默认消息结构
 * */
function defaultItem():IMsgItem {
  return {
    msgList: [],
    loadStatus: EMsgLoadStatus.none,
  };
}

/**
 * 利用二分法查找消息插入位置
 * */
function searchInsertIndex(list:IMessage[], target:IMessage) {
  const n = list.length;
  let left = 0;
  let right = n - 1;
  let index = n;

  if (n !== 0 && target.msgTime >= list[right].msgTime) {
    return n;
  }

  while (left <= right) {
    // eslint-disable-next-line no-bitwise
    const mid = ((right - left) >> 1) + left;
    if (target.msgTime <= list[mid].msgTime) {
      index = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return index;
}
export interface IMsgItem {
  msgList:IMessage[], // 消息列表
  loadStatus:EMsgLoadStatus // 加载状态
}

export interface IMsgState {
  msgMap:any // Object<string,IMsgItem[]>
}

const initialState:IMsgState = {
  msgMap: {},
};

export const loadMsgListAsync = createAsyncThunk(
  'msg/loadList',
  async (id:string) => {
    const { msgMap } = initialState;
    const { msgList, loadStatus } = (msgMap[id] || defaultItem()) as IMsgItem;

    if (loadStatus !== EMsgLoadStatus.none) {
      // 无需请求接口
      return [];
    }

    // 拿到当前消息列表中最老的事件
    let time = Date.now();
    if (msgList.length) {
      const firstMsg = msgList[0];
      time = firstMsg.msgTime;
    }

    const response = await mainBridge
      .server.msgSrv.fetchBeforeByTime(id, time, 0, 10);
    return response;
  },
);

export const msgSlice = createSlice({
  name: 'msg',
  initialState,
  reducers: {
    /**
     * 插入一条新消息
     * */
    insert: (state, action:PayloadAction<IMessage>) => {
      const { msgMap } = state;
      const newMsg = action.payload;
      const { id } = newMsg;
      const { msgList, loadStatus } = (msgMap[id] || defaultItem()) as IMsgItem;

      // // 去重
      // const i = msgList.findIndex((msgItem) => msgItem.msgId === newMsg.msgId);
      // if (i !== -1) {
      //   return;
      // }

      // 插入
      const index = searchInsertIndex(msgList, newMsg);
      msgList.splice(index, 0, newMsg);

      // 更新
      msgMap[id] = { msgList, loadStatus };
      state.msgMap = { ...msgMap };
    },
    /**
     * 更新一条消息
     * */
    update: (state, action:PayloadAction<IMessage>) => {
      const { msgMap } = state;
      const newMsg = action.payload;
      const { id } = newMsg;
      const { msgList } = (msgMap[id] || defaultItem()) as IMsgItem;

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
      msgList.splice(index, 1);
      const i = searchInsertIndex(msgList, newMsg);
      msgList.splice(i, 0, newMsg);
      state.msgMap = { ...msgMap };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMsgListAsync.fulfilled, (state, action) => {
        const { msgMap } = state;
        const newList = action.payload;
        if (!newList.length) {
          return;
        }
        const { id } = newList[0];
        const { msgList, loadStatus } = (msgMap[id] || defaultItem()) as IMsgItem;

        for (const msgItem of newList) {
          const index = searchInsertIndex(msgList, msgItem);
          msgList.splice(index, 0, msgItem);
        }

        // 更新
        msgMap[id] = { msgList, loadStatus };
        state.msgMap = { ...msgMap };
      });
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
    return defaultItem();
  }
  const id = mergeId(conversationId, userId);

  return (state.msg.msgMap[id] || defaultItem()) as IMsgItem;
};

export default msgSlice.reducer;
