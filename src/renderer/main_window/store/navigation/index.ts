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
      path: '/logged/msg',
      key: 'msg',
      icon: 'icon-xiaoxi',
      unreadCount: 0,
    },
    {
      name: '通讯录',
      path: '/logged/addressBook',
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
    name: 'none',
    path: '/',
    key: 'none',
    icon: '',
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
    changeActivaWithKey(state, action:PayloadAction<string>) {
      const nav = state.list.find((item) => item.key === action.payload);

      // 不存在，或者当前已选中，直接返回
      if (!nav || state.activa.key === action.payload) {
        return state;
      }

      window.history.pushState({ page_id: 1, user_id: 5 }, nav.path);

      return {
        ...state,
        activa: nav,
      };
    },
  },
});

export const { changeActiva, changeActivaWithKey } = navigationSlice.actions;

export const selectNavigationList = (state: RootState) => state.navigation.list;

export const selectNavigationActiva = (state: RootState) => state.navigation.activa;

export default navigationSlice.reducer;
