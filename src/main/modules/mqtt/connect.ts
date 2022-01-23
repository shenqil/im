/* eslint-disable no-param-reassign */
import mqtt, { IClientPublishOptions, PacketCallback } from 'mqtt';
import { v4 as uuidv4 } from 'uuid';
import config from '@main/config';
import { EEventName } from './enum';

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
    const { mqttServer } = config.sysConfig.domain;
    return new Promise((resolve, reject) => {
      let timeHandle:NodeJS.Timeout;
      this.client = mqtt.connect(mqttServer, {
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
        this.client?.end(true);
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
    const userNameTopic = `${this.username}/#`;

    // 获取主清单
    await this.subscribeTopic(userNameTopic);
    this.manifest = await this.fetchManifest();

    // 先订阅属于自己的消息
    await this.subscribeTopic(`${this.getUserID}/#`);
    this.unsubscribeTopic(userNameTopic);
  }

  /**
   * 获取主清单
   * */
  private async fetchManifest():Promise<IManifest> {
    const msgId = uuidv4(undefined);
    const res = await this.sendMsgWaitReplyBase({
      topic: `${this.serverPrefix}/manifest/get/${this.username}/${msgId}`,
      message: '',
      opts: {
        qos: 0,
        retain: false,
      },
    }, msgId);
    return JSON.parse(res as string);
  }

  /**
   * 订阅属于自己的主题
   * */
  subscribeTopic(topic:string) {
    return new Promise((resolve, reject) => {
      this.client?.subscribe(`${this.clientPrefix}/${topic}`, (err:Error) => {
        if (err) {
          reject(err);
          return;
        }
        resolve('');
      });
    });
  }

  /**
   * 取消订阅主题
   * */
  unsubscribeTopic(topic:string) {
    return new Promise((resolve, reject) => {
      this.client?.unsubscribe(`${this.clientPrefix}/${topic}`, (err:Error) => {
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

      if (!this.getUserID) {
        reject(new Error(`主题-${msg.topic}:用户未登录，不存在userID`));
        return;
      }

      // 监听回调
      this.listen(msgId, (res:unknown) => {
        // 清除定时器
        clearTimeout(timeHandle);
        resolve(res);
      });

      // 发送
      msg.topic = `${this.serverPrefix}/${msg.topic}/${this.getUserID}/${msgId}`;
      this.sendMsg(msg);

      // 超时
      timeHandle = setTimeout(() => {
        clearTimeout(timeHandle);
        this.remove(msgId);
        reject(new Error(`主题-${msg.topic}:数据接受超时`));
      }, this.replyTimeOut);
    });
  }

  /**
   * 发送一条消息，并等待对方回复，不判断用户id是否存在
   * */
  sendMsgWaitReplyBase(msg:IMsg, msgId:string) {
    return new Promise((resolve, reject) => {
      let timeHandle: NodeJS.Timeout;

      // 监听回调
      this.listen(msgId, (res:unknown) => {
        // 清除定时器
        clearTimeout(timeHandle);
        resolve(res);
      });

      // 发送
      this.sendMsg(msg);

      // 超时
      timeHandle = setTimeout(() => {
        clearTimeout(timeHandle);
        this.remove(msgId);
        reject(new Error(`主题-${msg.topic}:数据接受超时`));
      }, this.replyTimeOut);
    });
  }

  /**
   * 所有消息监听
   * */
  private onMessage(topic:string, message:Buffer) {
    // console.log('收到消息：', topic, message.toString());
    const topicAry = topic.split('/');
    // 检查主题固定头
    if (topicAry.length === 0 || topicAry[0] !== this.clientPrefix) {
      console.error('主题固定头不正确', topic, message.toString());
      return;
    }
    topicAry.shift();
    // 检查消息接收人
    if (topicAry.length === 0
      || (topicAry[0] !== this.getUserID && topicAry[0] !== this.username)) {
      return;
    }
    topicAry.shift();

    // 检查是否是已有处理函数
    const key = topicAry.slice(-1)[0] || '';
    if (this.trigger(key, message.toString(), true)) {
      return;
    }

    // 检查是否是好友关系相关的消息
    if (this.onFriendMsg(topicAry, message)) {
      return;
    }

    // 群组关系发生变化
    if (this.onGroupMsg(topicAry, message)) {
      return;
    }

    // 是否是单聊消息
    if (this.onSingleMsg(topicAry, message)) {
      return;
    }

    console.log('收到未处理的消息：', topic, message.toString());
  }

  /**
   * 好友关系变动 IMClient/userId/friend/type/msgId
   * */
  private onFriendMsg(topicAry:string[], message:Buffer) {
    if (topicAry[0] !== 'friend' || topicAry.length < 2) {
      return false;
    }

    let payload = {};
    try {
      payload = JSON.parse(message.toString());
    } catch {
      return false;
    }

    switch (topicAry[1]) {
      case 'change': {
        this.trigger(EEventName.friendChange, payload);
        return true;
      }

      default:
        return false;
    }
  }

  /**
   * 群组变动 IMClient/userId/group/type/groupID
   * */
  private onGroupMsg(topicAry:string[], message:Buffer) {
    if (topicAry[0] !== 'group' || topicAry.length < 2) {
      return false;
    }

    let payload = {};
    try {
      payload = JSON.parse(message.toString());
    } catch {
      return false;
    }

    switch (topicAry[1]) {
      case 'create': {
        this.trigger(EEventName.groupCreate, payload);
        return true;
      }

      case 'delete': {
        this.trigger(EEventName.groupDelete, payload);
        return true;
      }

      case 'update': {
        this.trigger(EEventName.groupUpdate, payload);
        return true;
      }

      case 'addMembers': {
        this.trigger(EEventName.groupAddMembers, payload);
        return true;
      }

      case 'delMembers': {
        this.trigger(EEventName.groupDelMembers, payload);
        return true;
      }

      case 'exitGroup': {
        this.trigger(EEventName.groupExitGroup, payload);
        return true;
      }

      default:
        return false;
    }
  }

  /**
   * 监听单聊消息 IMClient/userId/singleMsg/type/msgId
   * */
  private onSingleMsg(topicAry:string[], message:Buffer) {
    if (topicAry[0] !== 'singleMsg' || topicAry.length < 2) {
      return false;
    }

    let payload = {};
    try {
      payload = JSON.parse(message.toString());
    } catch {
      return false;
    }

    switch (topicAry[1]) {
      case 'new': {
        this.trigger(EEventName.singleMsgNew, payload);
        return true;
      }
      default:
        return false;
    }
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
  private trigger(key:string, params:unknown, once = false) {
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
  private remove(key:string) {
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

  /**
   * 获取用户ID
   * */
  get getUserID() {
    return this.manifest?.userID || '';
  }
}

export default new MQTTConnect();
