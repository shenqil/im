import { IMQTTConnect } from './connect';
import { IUser } from './user';

export * from './user';

export default interface IMQTT{
  connect:IMQTTConnect
  user:IUser
}
