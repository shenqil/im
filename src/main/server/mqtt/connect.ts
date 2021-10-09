import mqtt from 'mqtt';

export interface IMQTTConnect{
  login(username:string, password:string):Promise<unknown>
}

class MQTTConnect implements IMQTTConnect {
  private client:mqtt.Client | undefined;

  private eventMap:Map<string, Function>;

  constructor() {
    this.eventMap = new Map();
  }

  /**
   * 登录到mqtt服务
   * */
  login(username:string, password:string) {
    return new Promise((resolve, reject) => {
      let timeHandle:NodeJS.Timeout;

      this.client = mqtt.connect({
        protocol: 'mqtt',
        protocolVersion: 5,
        host: 'localhost',
        port: 1883,
        clientId: 'PC',
        username,
        password,
      });

      this.client.on('connect', (e) => {
        console.log(e);
        clearTimeout(timeHandle);
        resolve(e);
      });

      timeHandle = setTimeout(() => {
        clearTimeout(timeHandle);
        reject(new Error('登陆超时'));
      }, 10000);
    });
  }

  /**
   * 监听一个事件
   */
  listen(key:string, fn:Function) {
    this.eventMap.set(key, fn);
  }

  /**
   * 触发一次监听
   */
  trigger(key:string, params:any) {
    if (!this.eventMap.has(key)) {
      return false;
    }

    const fn = this.eventMap.get(key);
    this.eventMap.delete(key);

    if (typeof fn !== 'function') {
      return false;
    }

    try {
      fn(params);
    } catch (error) {
      console.error(error);
    }

    return true;
  }

  /**
   * 删除一个监听
   */
  remove(key:string) {
    return this.eventMap.delete(key);
  }
}

export default new MQTTConnect();
