/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMessage } from '@main/interface/msg';
import { mainBridge } from '@renderer/public/ipcRenderer';
import type { RootState } from '../index';

const LIMIT = 10; // 每条消息数量

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
  async ({ id, time }:{ id:string, time:number }, thunkAPI) => {
    const { getState, dispatch } = thunkAPI;
    const { msgMap } = (getState() as RootState).msg;
    const { loadStatus } = (msgMap[id] || defaultItem()) as IMsgItem;
    if (loadStatus !== EMsgLoadStatus.none) {
      // 重复请求不做处理
      return undefined;
    }

    // 将加载状态置为加载中
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    dispatch(changeLoadStatus({ id, loadStatus: EMsgLoadStatus.lodding }));

    // 开始请求
    const list = await mainBridge
      .server.msgSrv.fetchBeforeByTime(id, time, 0, LIMIT);
    if (!Array.isArray(list)) {
      return [];
    }
    return list;
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
      const { conversationId } = newMsg;
      const { msgList, loadStatus } = (msgMap[conversationId] || defaultItem()) as IMsgItem;

      // 插入
      const index = searchInsertIndex(msgList, newMsg);
      msgList.splice(index, 0, newMsg);

      // 更新
      msgMap[conversationId] = { msgList, loadStatus };
      state.msgMap = { ...msgMap };
    },
    /**
     * 更新一条消息
     * */
    update: (state, action:PayloadAction<IMessage>) => {
      const { msgMap } = state;
      const newMsg = action.payload;
      const { conversationId } = newMsg;
      const { msgList } = (msgMap[conversationId] || defaultItem()) as IMsgItem;

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
    /**
     * 改变loadmore状态
     * */
    changeLoadStatus: (state, action:PayloadAction<{ id:string, loadStatus:EMsgLoadStatus }>) => {
      const { msgMap } = state;
      const { id, loadStatus } = action.payload;
      const { msgList } = (msgMap[id] || defaultItem()) as IMsgItem;

      // 更新
      msgMap[id] = { msgList, loadStatus };
      state.msgMap = { ...msgMap };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMsgListAsync.fulfilled, (state, action) => {
        const { msgMap } = state;
        const { id } = action.meta.arg;
        const list = action.payload;
        const { msgList } = (msgMap[id] || defaultItem()) as IMsgItem;

        // 非法数据不做处理
        if (!list) {
          return;
        }

        // 插入得到的消息
        for (const msgItem of list) {
          const index = searchInsertIndex(msgList, msgItem);
          msgList.splice(index, 0, msgItem);
        }

        // 判断所有消息是否加载完毕
        const status = list.length === LIMIT ? EMsgLoadStatus.none : EMsgLoadStatus.finished;

        // 更新
        msgMap[id] = { msgList, loadStatus: status };
        state.msgMap = { ...msgMap };
      });
  },
});

export const {
  insert,
  update,
  changeLoadStatus,
} = msgSlice.actions;

// 当前会话的消息列表
export const selectMsgListByCurConversation = (state:RootState) => {
  const conversationId = state.conversation.activaId;
  const { userId } = state.user;
  if (!userId || !conversationId) {
    return defaultItem();
  }

  return (state.msg.msgMap[conversationId] || defaultItem()) as IMsgItem;
};

export default msgSlice.reducer;
