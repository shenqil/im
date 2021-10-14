/* eslint-disable import/extensions */
import React from 'react';
import { connect } from 'react-redux';
import IStore, { INavigationAction, INavigationItem, INavigationState } from '../../../store/interface';
import actions from '../../../store/navigation/actions';

interface IProps extends INavigationState {
  changeActiva(value:INavigationItem | undefined):INavigationAction
}

function Navigation(props:IProps) {
  const { activa, changeActiva } = props;
  console.log(activa);

  return (
    <div>
      <div>
        {JSON.stringify(activa)}
      </div>
      <button type="button" onClick={() => changeActiva(undefined)}>按钮</button>
    </div>
  );
}

const mapStateToPropsParam = (state:IStore) => state.navigation;

const mapDispatchToPropsParam = actions;

export default connect(mapStateToPropsParam, mapDispatchToPropsParam)(Navigation);
