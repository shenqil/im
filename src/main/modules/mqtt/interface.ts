import { IMQTTConnect } from './connect';
import { IUser } from './user';
import { IFriend } from './friend';
import { IGroup } from './group';
import { IMsg } from './msg';

export * from './user';
export * from './friend';
export * from './group';
export * from './msg';

export default interface IMQTT{
  connect:IMQTTConnect
  user:IUser
  friend:IFriend
  group:IGroup
  msg:IMsg
}
