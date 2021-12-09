import { IMQTTConnect } from './connect';
import { IUser } from './user';
import { IFriend } from './friend';
import { IGroup } from './group';

export * from './user';
export * from './friend';
export * from './group';

export default interface IMQTT{
  connect:IMQTTConnect
  user:IUser
  friend:IFriend
  group:IGroup
}
