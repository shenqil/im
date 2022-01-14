import { IConfig } from './interface';

const host = '101.36.105.242';
const url = `http://${host}:8080`;

const config:IConfig = {
  domain: {
    // API网关
    gatewayServer: `${url}/api`,
    // 文件服务
    fileServer: `${url}/files/files/`,
    mqttServer: `mqtt://${host}:1883`,
  },
};

export default config;
