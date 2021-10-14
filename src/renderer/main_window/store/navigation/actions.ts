import { ENavigationType, INavigationAction, INavigationItem } from './index';

export const changeActiva = (value:INavigationItem | undefined):INavigationAction => (
  {
    type: ENavigationType.activa,
    payload: value,
  }
);

export default {
  changeActiva,
};
