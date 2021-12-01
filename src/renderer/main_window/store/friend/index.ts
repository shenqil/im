import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IFriendInfo } from '@main/modules/mqtt/interface';
import type { IQuasiFriendSrv } from '@main/server/interface';
import { mainBridge } from '@renderer/public/ipcRenderer';
import { pinyin } from 'pinyin-pro';
import type { RootState } from '../index';

export interface IFriendState {
  friendList:Array<IFriendInfo>
  quasiFriendList:Array<IQuasiFriendSrv>
}

const initialState:IFriendState = {
  friendList: [],
  quasiFriendList: [],
};

export const fetchFriendListAsync = createAsyncThunk(
  'friend/fetchFriendList',
  async () => {
    const response = await mainBridge.server.friendSrv.myFriendList();
    return response;
  },
);
export const fetchQuasiFriendListAsync = createAsyncThunk(
  'friend/fetchQuasiFriendList',
  async () => {
    const response = await mainBridge.server.friendSrv.quasiFriendList();
    return response;
  },
);

export const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    changeFriendList: (state, action: PayloadAction<IFriendInfo[]>) => ({
      ...state,
      friendList: action.payload,
    }),
    changeQuasiFriendList: (state, action:PayloadAction<IQuasiFriendSrv[]>) => ({
      ...state,
      quasiFriendList: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriendListAsync.fulfilled, (state, action) => ({
        ...state,
        friendList: action.payload,
      }))
      .addCase(fetchQuasiFriendListAsync.fulfilled, (state, action) => ({
        ...state,
        quasiFriendList: action.payload,
      }));
  },
});

export const { changeFriendList, changeQuasiFriendList } = friendSlice.actions;

// 好友列表
export const selectFriendList = (state: RootState) => state.friend.friendList;
// 带字母分组的好友列表
export const selectGroupedFriendList = (state: RootState) => {
  const groupedFriendList:Array<{ pinyin:string, list:Array<IFriendInfo> }> = [];

  for (const friend of state.friend.friendList) {
    let py = '#';
    const firstName = friend.realName.slice(0, 1);

    if (/[\u4E00-\u9FA5]/.test(firstName)) {
      // 中文
      py = pinyin(friend.realName.slice(0, 1), { pattern: 'first', toneType: 'none' }) || '#';
    } else if (/[A-Za-z]/.test(firstName)) {
      // 英文
      py = firstName;
    }

    py = py.toUpperCase();

    const group = groupedFriendList.find((item) => item.pinyin === py);
    if (group) {
      group.list.push(friend);
    } else {
      groupedFriendList.push({ pinyin: py, list: [friend] });
    }
  }

  return groupedFriendList.sort((a, b) => a.pinyin.charCodeAt(0) - b.pinyin.charCodeAt(0));
};

// 准好友列表
export const selectQuasiFriendList = (state:RootState) => state.friend.quasiFriendList;

export default friendSlice.reducer;
