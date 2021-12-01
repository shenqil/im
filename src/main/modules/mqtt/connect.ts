/* eslint-disable no-param-reassign */
import mqtt, { IClientPublishOptions, PacketCallback } from 'mqtt';
import { v4 as uuidv4 } from 'uuid';

export interface IManifest {
  userID:string
}

export interface IMsg {
  topic:string,
  message:Buffer | string,
  opts:IClientPublishOptions,
  callback?:PacketCallback
}

export interface IMQTTConnect{
  login(username:string, password:string):Promise<unknown>
  signOut():void
}

class MQTTConnect implements IMQTTConnect {
  private client:mqtt.Client | undefined;

  private eventMap:Map<string, Function>;

  private replyTimeOut = 5000;

  private username:string;

  private password:string;

  private manifest :IManifest | undefined;

  public serverPrefix = 'IMServer';

  public clientPrefix = 'IMClient';

  constructor() {
    this.eventMap = new Map();
    this.username = '';
    this.password = '';
  }

  /**
   * 登录到mqtt服务
   * */
  login(username:string, password:string) {
    if (this.client) {
      // 已连接，则先退出登录
      this.signOut();
    }

    // 保存登录信息
    this.username = username;
    this.password = password;
    return new Promise((resolve, reject) => {
      let timeHandle:NodeJS.Timeout;
      this.client = mqtt.connect('mqtt://localhost:1883', {
        protocolVersion: 4,
        clientId: 'PC',
        username,
        password,
        clean: false,
      });

      this.client.on('connect', async () => {
        clearTimeout(timeHandle);

        try {
          await this.init();
          resolve('登录成功');
        } catch (error) {
          reject(error);
        }
      });

      this.client.on('reconnect', (error:any) => {
        console.warn('正在重连:', error);
      });

      this.client.on('error', (error) => {
        console.error('连接失败:', error);
      });

      // 监听所有消息
      this.client.on('message', this.onMessage.bind(this));

      timeHandle = setTimeout(() => {
        clearTimeout(timeHandle);
        reject(new Error('登陆超时'));
      }, this.replyTimeOut);
    });
  }

  /**
   * 退出登录
   * */
  signOut() {
    // 退出
    this.client?.end(true);
    // 清空数据
    this.clearData();
  }

  /**
   * 初始化
   * */
  private async init() {
    // 先订阅属于自己的消息
    await this.subscribeSelfTopic();

    // 获取主清单
    this.manifest = await this.fetchManifest();
  }

  /**
   * 获取主清单
   * */
  private async fetchManifest():Promise<IManifest> {
    const res = await this.sendMsgWaitReply({
      topic: 'manifest/get',
      message: '',
      opts: {
        qos: 0,
        retain: false,
      },
    });
    return JSON.parse(res as string);
  }

  /**
   * 订阅属于自己的主题
   * */
  subscribeSelfTopic() {
    return new Promise((resolve, reject) => {
      if (!this.username) {
        reject(new Error('用户名称不存在'));
        return;
      }
      this.client?.subscribe(`${this.clientPrefix}/${this.username}/#`, (err:Error) => {
        if (err) {
          reject(err);
          return;
        }
        resolve('');
      });
    });
  }

  /**
   * 清理所有数据
   * */
  private clearData() {
    this.username = '';
    this.password = '';
    this.eventMap.clear();
    this.manifest = undefined;
    this.client = undefined;
  }

  /**
   * 发送一条消息
   * */
  sendMsg(msg:IMsg) {
    if (this.client) {
      this.client.publish(msg.topic, msg.message, msg.opts, msg.callback);
    }
  }

  /**
   * 发送一条消息，并等待对方回复
   * */
  sendMsgWaitReply(msg:IMsg, msgId = uuidv4(undefined)) {
    return new Promise((resolve, reject) => {
      let timeHandle: NodeJS.Timeout;

      if (!this.getUserName) {
        reject(new Error('用户未登录，不存在username'));
        return;
      }

      // 监听回调
      this.listen(msgId, (res:unknown) => {
        // 清除定时器
        clearTimeout(timeHandle);
        resolve(res);
      });

      // 发送
      msg.topic = `${this.serverPrefix}/${msg.topic}/${this.getUserName}/${msgId}`;
      this.sendMsg(msg);

      // 超时
      timeHandle = setTimeout(() => {
        clearTimeout(timeHandle);
        this.remove(msgId);
        reject(new Error('数据接受超时'));
      }, this.replyTimeOut);
    });
  }

  /**
   * 所有消息监听
   * */
  private onMessage(topic:string, message:Buffer) {
    const topicAry = topic.split('/');
    // 检查主题固定头
    if (topicAry.length === 0 || topicAry[0] !== this.clientPrefix) {
      return;
    }
    topicAry.shift();
    // 检查消息接收人
    if (topicAry.length === 0 || topicAry[0] !== this.username) {
      return;
    }
    topicAry.shift();

    // 检查是否是已有处理函数
    const key = topicAry.slice(-1)[0] || '';
    if (this.trigger(key, message.toString(), true)) {
      return;
    }

    console.log('收到未处理的消息：', topic, message.toString());
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
  trigger(key:string, params:unknown, once = false) {
    if (!this.eventMap.has(key)) {
      return false;
    }

    const fn = this.eventMap.get(key);
    if (once) {
      this.eventMap.delete(key);
    }

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

  /**
   * 外部获取主清单
   * */
  get getManifest() {
    return Object.freeze(this.manifest);
  }

  /**
   * 获取用户名称
   * */
  get getUserName() {
    return this.username;
  }
}

export default new MQTTConnect();
