/* eslint-disable no-param-reassign */
import { Action } from 'redux';

export enum ENavigationType {
  activa = 'ACTIVA',
}

export interface INavigationItem {
  key:string,
  name:string,
  icon:string,
  unreadCount?:number,
}

export interface INavigationState {
  list:INavigationItem[],
  activa:INavigationItem | undefined
}

export interface INavigationAction extends Action{
  type:ENavigationType
  payload:INavigationItem[] | INavigationItem | undefined
}

const defaultState:INavigationState = {
  list: [
    {
      name: '消息',
      key: 'msg',
      icon: 'icon-xiaoxi',
      unreadCount: 0,
    },
    {
      name: '通讯录',
      key: 'addressBook',
      icon: 'icon-tongxunlu',
      unreadCount: 0,
    },
    {
      name: '设置',
      key: 'seting',
      icon: 'icon-gengduo',
      unreadCount: 0,
    },
  ],
  activa: undefined,
};

function reducer(state = defaultState, action:INavigationAction) {
  switch (action.type) {
    case ENavigationType.activa: {
      if (!Array.isArray(action.payload)) {
        return {
          activa: action.payload,
          list: [...state.list],
        };
      }
      break;
    }
    default:
      break;
  }

  return state;
}

export default reducer;
