import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IConversationInfo } from '@main/modules/sqlite3/interface';
import { mainBridge } from '@renderer/public/ipcRenderer';
import type { RootState } from '../index';

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
    updateConversation: (state, action:PayloadAction<IConversationInfo>) => {
      const info = action.payload;
      const list = [...state.list];
      const index = list.findIndex((item) => item.id === info.id);
      if (index !== -1) {
        list.splice(index, 1, info);
      } else {
        list.unshift(info);
      }

      return {
        ...state,
        list,
      };
    },
    removeConversation: (state, action:PayloadAction<IConversationInfo>) => {
      const info = action.payload;
      const list = [...state.list];
      const index = list.findIndex((item) => item.id === info.id);
      if (index !== -1) {
        list.splice(index, 1);
      }

      return {
        ...state,
        list,
      };
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
  updateConversation,
  removeConversation,
} = conversationSlice.actions;

// 会话列表
export const conversationList = (state:RootState) => state.conversation.list;
// 排序后的会话列表
export const conversationSortList = (state:RootState) => {
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

export default conversationSlice.reducer;
