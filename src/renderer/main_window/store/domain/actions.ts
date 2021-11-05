import {
  IActivasFunc, EDomainType, IDomainAction, IDomainState,
} from '../interface';

export const changeDomain = (value:IDomainState):IDomainAction => (
  {
    type: EDomainType.change,
    payload: value,
  }
);

export interface INavigationActions {
  changeDomain: IActivasFunc<IDomainState, IDomainState>
}

export default {
  changeDomain,
};
