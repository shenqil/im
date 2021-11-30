import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFriendInfo } from '@main/modules/mqtt/interface';
import { mainBridge } from '@renderer/public/ipcRenderer';
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
});

export const { changeFriendList } = friendSlice.actions;

export const selectFriendList = (state: RootState) => state.friend.friendList;

export default friendSlice.reducer;
