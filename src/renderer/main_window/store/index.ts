import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import domainReducer from './domain';
import userReducer from './user';
import friendReducer from './friend';
import groupReducer from './group';
import navigationReducer from './navigation';
import conversationReducer from './conversation';

export const store = configureStore({
  reducer: {
    domain: domainReducer,
    user: userReducer,
    navigation: navigationReducer,
    friend: friendReducer,
    group: groupReducer,
    conversation: conversationReducer,
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
