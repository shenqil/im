import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFriendInfo } from '@main/modules/mqtt/interface';
import { mainBridge } from '@renderer/public/ipcRenderer';
import { pinyin } from 'pinyin-pro';
import type { RootState } from '../index';

export interface IFriendState {
  friendList:Array<IFriendInfo>
}

const initialState:IFriendState = {
  friendList: [],
};

export const fetchFriendListAsync = createAsyncThunk(
  'friend/fetchFriendList',
  async () => {
    const response = await mainBridge.server.friendSrv.getMyFriendList();
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriendListAsync.fulfilled, (state, action) => ({
        ...state,
        friendList: action.payload,
      }));
  },
});

export const { changeFriendList } = friendSlice.actions;

export const selectFriendList = (state: RootState) => state.friend.friendList;
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

export default friendSlice.reducer;
