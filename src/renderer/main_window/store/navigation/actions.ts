import {
  IActivasFunc, ENavigationType, INavigationAction, INavigationItem,
} from '../interface';

export const changeActiva = (value:INavigationItem):INavigationAction => (
  {
    type: ENavigationType.activa,
    payload: value,
  }
);

export interface INavigationActions {
  changeActiva: IActivasFunc<INavigationItem, INavigationAction>
}

export default {
  changeActiva,
};
