import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IConversationInfo } from '@main/modules/sqlite3/interface';
import { mainBridge } from '@renderer/public/ipcRenderer';
import type { RootState } from '../index';

/**
 * 输入框编辑内容备份
 * */
export const editContentBackupMap:Map<string, string> = new Map();

/**
 * 定义会话列表
 * */
export interface IConversationState {
  list:Array<IConversationInfo>,
  activaId:String
}

const initialState:IConversationState = {
  list: [],
  activaId: '',
};

export const fetchConversationListAsync = createAsyncThunk(
  'conversation/fetchList',
  async () => {
    const res = await mainBridge.server.conversationSrv.get();
    return res;
  },
);

export const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    changeActivaId: (state, action:PayloadAction<String>) => ({
      ...state,
      activaId: action.payload,
    }),
    changeConversationList: (state, action:PayloadAction<IConversationInfo[]>) => ({
      ...state,
      list: action.payload,
    }),
    conversationaRemove: (state, action:PayloadAction<string>) => {
      // 会话删除，清空对应的备份
      editContentBackupMap.delete(action.payload);
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversationListAsync.fulfilled, (state, action) => ({
        ...state,
        list: action.payload,
      }));
  },
});

export const {
  changeActivaId,
  changeConversationList,
  conversationaRemove,
} = conversationSlice.actions;

// 会话列表
export const selectConversationList = (state:RootState) => state.conversation.list;
// 排序后的会话列表
export const selectConversationSortList = (state:RootState) => {
  const { list } = state.conversation;
  const placedTopList:IConversationInfo[] = [];
  const nomarlList:IConversationInfo[] = [];

  function insert(sortList:IConversationInfo[], conversation:IConversationInfo) {
    const index = sortList.findIndex((item) => conversation.lastTime >= item.lastTime);
    sortList.splice(index, 0, conversation);
  }

  for (const item of list) {
    if (item.placedTop) {
      insert(placedTopList, item);
    } else {
      insert(nomarlList, item);
    }
  }

  return [...placedTopList, ...nomarlList];
};
// 当前选中的会话id
export const selectActivaId = (state:RootState) => state.conversation.activaId;
// 当前选中的会话
export const selectActivaConversation = (state:RootState) => {
  const { list } = state.conversation;
  const id = state.conversation.activaId;

  const conversation = list.find((item) => item.id === id);
  return conversation;
};

export default conversationSlice.reducer;
