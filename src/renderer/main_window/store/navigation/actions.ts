import { ENavigationType, INavigationAction, INavigationItem } from './index';
import { IActivasFunc } from '../interface';

export const changeActiva = (value:INavigationItem | undefined):INavigationAction => (
  {
    type: ENavigationType.activa,
    payload: value,
  }
);

export interface INavigationActions {
  changeActiva: IActivasFunc<INavigationItem | undefined, INavigationAction>
}

export default {
  changeActiva,
};
