import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import navigation from './navigation/index';
import userInfo from './userInfo/index';

const reducer = combineReducers({
  navigation,
  userInfo,
});

const store = createStore(reducer, applyMiddleware(thunk));

export default store;
