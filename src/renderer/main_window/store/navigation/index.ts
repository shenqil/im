/* eslint-disable no-param-reassign */
import { Action } from 'redux';

export enum ENavigationType {
  activa = 'ACTIVA',
}

export interface INavigationItem {
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
      icon: '',
      unreadCount: 0,
    },
  ],
  activa: {
    name: '消息',
    icon: '',
    unreadCount: 0,
  },
};

function reducer(state = defaultState, action:INavigationAction) {
  console.log(state, action);
  switch (action.type) {
    case ENavigationType.activa: {
      if (!Array.isArray(action.payload)) {
        state.activa = action.payload;
      }
      break;
    }
    default:
      break;
  }

  return JSON.parse(JSON.stringify(state));
}

export default reducer;
