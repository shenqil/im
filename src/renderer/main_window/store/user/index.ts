import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUserInfo } from '@main/modules/mqtt/interface';
import { mainBridge } from '@renderer/public/ipcRenderer';
import type { RootState } from '../index';

export interface IUserState {
  userInfo:IUserInfo | undefined,
  userId:string
}

const initialState: IUserState = {
  userInfo: undefined,
  userId: '',
};

export const fetchUserInfoAsync = createAsyncThunk(
  'user/fetchUserInfo',
  async () => {
    const response = await mainBridge.server.userSrv.getUserInfo();
    return response;
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    chanegUserInfo: (state, action: PayloadAction<IUserInfo>) => ({
      userId: action.payload.id,
      userInfo: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfoAsync.fulfilled, (state, action) => ({
        userId: action.payload.id,
        userInfo: action.payload,
      }));
  },
});

export const { chanegUserInfo } = userSlice.actions;

export const selectUserInfo = (state: RootState) => state.user.userInfo;

export default userSlice.reducer;
