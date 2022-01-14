import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IConfig } from '@src/config/interface';
import sysConfig from '@src/config';
import type { RootState } from '../index';

export interface IConfigState {
  sysConfig:IConfig
}

const initialState:IConfigState = {
  sysConfig,
};

export const ConfigSlice = createSlice({
  name: 'Config',
  initialState,
  reducers: {
    changeConfig: (_state, action: PayloadAction<IConfigState>) => action.payload,
  },
});

export const { changeConfig } = ConfigSlice.actions;

export const selectConfig = (state:RootState) => state.config;
export const selectFileServer = (state: RootState) => state.config.sysConfig.domain.fileServer;

export default ConfigSlice.reducer;
