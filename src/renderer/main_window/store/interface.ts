import { INavigationState } from './navigation/index';

export * from './navigation/index';

export interface IActivasFunc<T, U> {
  (value:T): U;
}

export default interface IStore {
  navigation:INavigationState
}
