import { Action } from 'redux';
import { IUserInfo as IUInfo } from '@main/modules/mqtt/interface';

export enum EUserInfoType {
  change = 'CHANGE',
}

export interface IUserInfo extends IUInfo{}

export interface IUserInfoState {
  userInfo:IUserInfo | undefined
}

export interface IUserInfoAction extends Action {
  type:EUserInfoType
  userInfo:IUserInfo
}

const defaultState:IUserInfoState = {
  userInfo: undefined,
};

function reducer(state = defaultState, action:IUserInfoAction) {
  switch (action.type) {
    case EUserInfoType.change: {
      return {
        ...state,
        userInfo: action.userInfo,
      };
    }
    default:
      break;
  }

  return state;
}

export default reducer;
