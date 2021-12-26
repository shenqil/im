import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IGroupInfo } from '@main/modules/mqtt/interface';
import { mainBridge } from '@renderer/public/ipcRenderer';
import type { RootState } from '../index';

export interface IGroupState {
  groupList:Array<IGroupInfo>
}

const initialState:IGroupState = {
  groupList: [],
};

export const fetchGroupListAsync = createAsyncThunk(
  'group/fetchGroupList',
  async () => {
    const response = await mainBridge.server.groupSrv.myGroupList();
    return response;
  },
);

export const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    changeGroupList: (state, action:PayloadAction<IGroupInfo[]>) => ({
      ...state,
      groupList: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupListAsync.fulfilled, (state, action) => ({
        ...state,
        groupList: action.payload,
      }));
  },
});

export const { changeGroupList } = groupSlice.actions;

// 群组列表
export const selectGroupList = (state: RootState) => state.group.groupList;

export default groupSlice.reducer;
