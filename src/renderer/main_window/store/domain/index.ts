import { Action } from 'redux';

export enum EDomainType {
  change = 'CHANGE',
}

export interface IDomainState {
  fileServer:string
}

export interface IDomainAction extends Action {
  type:EDomainType
  payload:IDomainState
}

const defaultState:IDomainState = {
  fileServer: 'http://localhost:8080/files/files/',
};

function reducer(state = defaultState, action:IDomainAction) {
  switch (action.type) {
    case EDomainType.change: {
      return action.payload;
    }
    default:
      break;
  }

  return state;
}

export default reducer;
