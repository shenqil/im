import { contextBridge } from 'electron';
import config from '../../config/index';

contextBridge.exposeInMainWorld('domainConfig', {
  ...config.domain,
});
