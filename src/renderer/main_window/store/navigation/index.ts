import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export interface INavigationItem {
  key:string,
  name:string,
  path:string,
  icon:string,
  unreadCount?:number,
}

export interface INavigationState {
  list:INavigationItem[],
  activa:INavigationItem
}

const initialState: INavigationState = {
  list: [
    {
      name: '消息',
      path: '/',
      key: 'msg',
      icon: 'icon-xiaoxi',
      unreadCount: 0,
    },
    {
      name: '通讯录',
      path: '/addressBook',
      key: 'addressBook',
      icon: 'icon-tongxunlu',
      unreadCount: 0,
    },
    {
      name: '设置',
      path: '',
      key: 'seting',
      icon: 'icon-gengduo',
      unreadCount: 0,
    },
  ],
  activa: {
    name: '消息',
    path: '/',
    key: 'msg',
    icon: 'icon-xiaoxi',
    unreadCount: 0,
  },
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    changeActiva(state, action:PayloadAction<INavigationItem>) {
      return {
        ...state,
        activa: action.payload,
      };
    },
  },
});

export const { changeActiva } = navigationSlice.actions;

export const selectNavigationList = (state: RootState) => state.navigation.list;

export const selectNavigationActiva = (state: RootState) => state.navigation.activa;

export default navigationSlice.reducer;
