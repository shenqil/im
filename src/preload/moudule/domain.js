import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('domainConfig', {
  homeUrl: 'http://localhost:8080',
  // API网关
  gatewayServer: 'http://localhost:8080/api',
  // 文件服务
  fileServer: 'http://localhost:8080/files/files/',
});
