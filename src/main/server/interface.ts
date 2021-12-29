import type { IConnectSrv } from './connectSrv';
import type { IUserSrv } from './userSrv';
import type { IFriendSrv } from './friendSrv';
import type { IGroupSrv } from './groupSrv';
import { IFileSrc } from './fileSrv';
import { IConversationSrv } from './conversationSrv';

export * from './userSrv';
export * from './friendSrv';
export * from './groupSrv';
export * from './fileSrv';
export * from './conversationSrv';
export default interface IServer{
  connectSrv:IConnectSrv,
  userSrv:IUserSrv,
  friendSrv:IFriendSrv,
  groupSrv:IGroupSrv,
  fileSrv:IFileSrc,
  conversationSrv:IConversationSrv
}
