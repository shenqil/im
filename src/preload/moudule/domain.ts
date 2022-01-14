import { contextBridge } from 'electron';
import config from '@src/config';

contextBridge.exposeInMainWorld('domainConfig', {
  ...config.domain,
});
