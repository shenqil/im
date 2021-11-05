import { IConnectSrv } from './connectSrv';
import { IUserSrv } from './userSrv';

export default interface IServer{
  connectSrv:IConnectSrv,
  userSrv:IUserSrv
}
