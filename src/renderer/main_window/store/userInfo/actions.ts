import { Dispatch } from 'redux';
import { mainBridge } from '../../../public/ipcRenderer/index';
import {
  IActivasFunc, IUserInfo, IUserInfoAction, EUserInfoType,
} from '../interface';

export const chanegUserInfo = (v:IUserInfo):IUserInfoAction => (
  {
    type: EUserInfoType.change,
    userInfo: v,
  }
);

export function fetchUserInfo():IActivasFunc<Dispatch<IUserInfoAction>, void> {
  return (dispatch:Dispatch<IUserInfoAction>) => {
    mainBridge.server.userSrv.getUserInfo()
      .then((res) => {
        dispatch(chanegUserInfo(res));
      });
  };
}

export interface IUserInfoActions {
  chanegUserInfo:IActivasFunc<IUserInfo, IUserInfoAction>
  fetchUserInfo:IActivasFunc<void, void>
}

export default {
  chanegUserInfo,
  fetchUserInfo,
};
