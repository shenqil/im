import { combineReducers, createStore } from 'redux';
import navigation from './navigation/index';

const reducer = combineReducers({
  navigation,
});

const store = createStore(reducer);

export default store;
