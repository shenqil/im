import { IMQTTConnect } from './connect';
import { IUser } from './user';
import { IFriend } from './friend';

export * from './user';
export * from './friend';

export default interface IMQTT{
  connect:IMQTTConnect
  user:IUser
  friend:IFriend
}
