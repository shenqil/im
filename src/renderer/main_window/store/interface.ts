import { INavigationState } from './navigation/index';
import { IUserInfoState } from './userInfo/index';
import { IDomainState } from './domain/index';

export * from './navigation/index';
export * from './userInfo/index';
export * from './domain/index';

export interface IActivasFunc<T, U> {
  (value:T): U;
}

export default interface IStore {
  navigation:INavigationState
  userInfo:IUserInfoState
  domain:IDomainState
}
