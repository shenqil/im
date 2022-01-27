/* eslint-disable class-methods-use-this */
import ipcEvent from '@main/ipcMain/event';
import { EMainEventKey } from '@main/ipcMain/eventInterface';
import { IUserBaseInfo } from '@main/modules/sqlite3/interface';
import conversationSrv from '@main/server/conversationSrv';
import mqtt from '../modules/mqtt';
import type { IUserInfo, IToken } from '../modules/mqtt/interface';
import SQ3 from '../modules/sqlite3';
import { ESQ3CommonKey } from '../modules/sqlite3/interface';

export interface IUserSrv {
  getUserInfo():Promise<IUserInfo>
  getToken():Promise<IToken>
  getUserLoginInfo():Promise<ILoginInfo>
  saveUserLoginInfo(params:ILoginInfo):Promise<unknown>

  cacheUserInfo(info:IUserBaseInfo):void
  getCacheUserInfo(ids:string[], noCache?:boolean):Promise<IUserBaseInfo[]>
}
export interface ILoginInfo {
  username:string,
  password:string,
  remember:boolean,
  autoLogin:boolean
}

class UserSrv implements IUserSrv {
  private token: IToken | undefined;

  private userInfo: IUserInfo | undefined;

  private allUserInfoList:Map<string, IUserBaseInfo>; // 所有用户信息

  private cacheUserInfoQueue:IUserBaseInfo[];

  private cacheUserInfoStatus:boolean;

  constructor() {
    this.allUserInfoList = new Map();
    this.cacheUserInfoQueue = [];
    this.cacheUserInfoStatus = false;
  }

  /**
   * 初始化
   * */
  async init() {
    const userInfo = await this.getUserInfo();
    ipcEvent.emit(EMainEventKey.UserInfoChange, userInfo);
    return userInfo;
  }

  /**
     * 清空数据
     * */
  clear() {
    this.token = undefined;
    this.userInfo = undefined;
  }

  // ================================ 接口 ================================

  /**
   * 获取token 带缓存
   * */
  async getToken(): Promise<IToken> {
    if (this.token) {
      return Object.freeze(this.token);
    }

    this.token = await mqtt.user.fetchToken();

    return Object.freeze(this.token);
  }

  /**
   * 获取用户信息
   * */
  async getUserInfo(): Promise<IUserInfo> {
    if (this.userInfo) {
      return Object.freeze(this.userInfo);
    }

    this.userInfo = await mqtt.user.fetchInfo();

    return Object.freeze(this.userInfo);
  }

  /**
   * 获取用户基本信息
   * */
  private async getUserBaseInfo(ids:string[]):Promise<IUserBaseInfo[]> {
    if (!ids.length) {
      return [];
    }
    return mqtt.user.getFriendInfo(ids);
  }

  /**
   * 获取缓存的登录信息
   * */
  async getUserLoginInfo():Promise<ILoginInfo > {
    const res = await SQ3.common.getData(ESQ3CommonKey.userLoginInfo);
    if (!res) {
      return {
        username: '',
        password: '',
        remember: false,
        autoLogin: false,
      };
    }
    return JSON.parse(res) as ILoginInfo;
  }

  /**
   * 缓存当前登录人信息
   * */
  async saveUserLoginInfo(params:ILoginInfo) {
    const loginInfo = params;
    if (!loginInfo.remember) {
      loginInfo.username = '';
      loginInfo.password = '';
      loginInfo.autoLogin = false;
    }
    return SQ3.common.saveData(ESQ3CommonKey.userLoginInfo, JSON.stringify(loginInfo));
  }

  // ================================ 接口 ================================

  //  ================================ 缓存用户信息 =========================
  /**
   * 判断两个对象是否相等
   * */
  private isObjectChanged(source:Object, comparison:object) {
    const s = JSON.stringify(source);
    const c = JSON.stringify({ ...source, ...comparison });
    return s !== c;
  }

  /**
   * 将用缓存的用户信息队列，一次保存
   * */
  private userInfoQueue() {
    if (this.cacheUserInfoStatus || !this.cacheUserInfoQueue.length) {
      return;
    }
    const info = this.cacheUserInfoQueue.shift();
    if (!info) {
      return;
    }

    this.cacheUserInfoStatus = true;
    SQ3.userInfo.save(info.id, info)
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        this.cacheUserInfoStatus = false;
        this.userInfoQueue();
      });
  }

  /**
   * 缓存用户信息
   * */
  cacheUserInfo(info:IUserBaseInfo) {
    const oldInfo = this.allUserInfoList.get(info.id);
    if (oldInfo && this.isObjectChanged(oldInfo, info)) {
      // 存在且相等
      return;
    }

    this.allUserInfoList.set(info.id, info);
    conversationSrv.updateWithUserInfo(info);

    const index = this.cacheUserInfoQueue.findIndex((item) => item.id === info.id);
    if (index !== -1) {
      this.cacheUserInfoQueue.splice(index, 1, info);
    } else {
      this.cacheUserInfoQueue.push(info);
    }
    this.userInfoQueue();
  }

  /**
   * 获取用户信息，优先取缓存
   * */
  async getCacheUserInfo(ids:string[], noCache = false):Promise<IUserBaseInfo[]> {
    const resultInfo = [];
    // 分三步，第一步取内存，第二步取本地数据库，第三步取服务器
    const overIds1 = [];
    const overIds2 = [];

    if (!noCache) {
    // 1.取内存
      for (const id of ids) {
        const info = this.allUserInfoList.get(id);
        if (info) {
          resultInfo.push(info);
        } else {
          overIds1.push(id);
        }
      }
      if (!overIds1.length) {
        return resultInfo;
      }

      // 2.取本地数据库
      const sq3List = await SQ3.userInfo.fetch([...overIds1]);
      // 2.1缓存
      for (const iterator of sq3List) {
        this.allUserInfoList.set(iterator.id, iterator);
        resultInfo.push(iterator);
      }
      // 2.2找出剩余的
      for (const id of overIds1) {
        const index = sq3List.findIndex((item) => item.id === id);
        if (index === -1) {
          overIds2.push(id);
        }
      }
      if (!overIds2.length) {
        return resultInfo;
      }
    }

    // 3.取服务器
    const serveList = await this.getUserBaseInfo(noCache ? ids : overIds2);
    // 3.1缓存
    for (const iterator of serveList) {
      this.cacheUserInfo(iterator);
      resultInfo.push(iterator);
    }

    return resultInfo;
  }
}

export default new UserSrv();
