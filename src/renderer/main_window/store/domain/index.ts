import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export interface IDomainState {
  fileServer:string
}

const initialState:IDomainState = {
  fileServer: window.domainConfig.fileServer,
};

export const domainSlice = createSlice({
  name: 'domain',
  initialState,
  reducers: {
    changeDomain: (_state, action: PayloadAction<IDomainState>) => action.payload,
  },
});

export const { changeDomain } = domainSlice.actions;

export const selectFileServer = (state: RootState) => state.domain.fileServer;

export default domainSlice.reducer;
