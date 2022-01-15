import { IMQTTConnect } from './connect';
import { IUser } from './user';
import { IFriend } from './friend';
import { IGroup } from './group';
import { ISingleMsg } from './singleMsg';

export * from './user';
export * from './friend';
export * from './group';
export * from './singleMsg';

export default interface IMQTT{
  connect:IMQTTConnect
  user:IUser
  friend:IFriend
  group:IGroup
  singleMsg:ISingleMsg
}
