import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import configReducer from './config';
import userReducer from './user';
import friendReducer from './friend';
import groupReducer from './group';
import navigationReducer from './navigation';
import conversationReducer from './conversation';
import msgReducer from './msg';

export const store = configureStore({
  reducer: {
    config: configReducer,
    user: userReducer,
    navigation: navigationReducer,
    friend: friendReducer,
    group: groupReducer,
    conversation: conversationReducer,
    msg: msgReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>;
