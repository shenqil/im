import { IConnectSrv } from './connectSrv';
import { IUserSrv } from './userSrv';
import { IFriendSrv } from './friendSrv';

export * from './userSrv';
export * from './friendSrv';
export default interface IServer{
  connectSrv:IConnectSrv,
  userSrv:IUserSrv,
  friendSrv:IFriendSrv
}
