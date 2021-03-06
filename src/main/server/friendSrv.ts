/* eslint-disable no-lonely-if */
/* eslint-disable class-methods-use-this */
import ipcEvent from '@main/ipcMain/event';
import { EMainEventKey } from '@main/ipcMain/eventInterface';
import conversationSrv from '@main/server/conversationSrv';
import { EFriendStatus } from '@main/modules/mqtt/enum';
import { IFriendInfo, IQuasiFriend } from '../modules/mqtt/interface';
import mqtt from '../modules/mqtt/index';
import userSrv from './userSrv';

export interface IFriendInfoSrv extends IFriendInfo{
  isFriend:boolean
}

export interface IQuasiFriendSrv extends IQuasiFriend {
  selfStatus:EFriendStatus
  friendStatus:EFriendStatus
}

export interface IFriendSrv {
  changeFriends(list:IFriendInfo[]):void
  changeQuasiFriends(list:IQuasiFriendSrv[]):void
  getMyFriendList(): Promise<IFriendInfo[]>
  getQuasiFriendList(): Promise<IQuasiFriendSrv[]>
  search(keywords:string):Promise<IFriendInfoSrv | undefined>
  myFriendList():Promise<Array<IFriendInfo>>
  quasiFriendList():Promise<Array<IQuasiFriendSrv>>
  add(userId:string):Promise<unknown>
  ignore(userId:string):Promise<unknown>
  remove(userId:string):Promise<unknown>
}

class FriendSrv implements IFriendSrv {
  private friends:IFriendInfo[];

  private quasiFriends:IQuasiFriendSrv[];

  constructor() {
    this.friends = [];
    this.quasiFriends = [];
    this.listenMQTTEvent();
  }

  /**
   * 监听mqtt 事件
   *
   * 每次退出登录后,事件会被清空
   * */
  listenMQTTEvent() {
    mqtt.friend.onFriendChange(this.onFriendChange.bind(this));
  }

  /**
   * 初始化
   * */
  async init() {
    await this.myFriendList();
    await this.quasiFriendList();
  }

  /**
   * 清空数据
   * */
  clear() {
    this.friends = [];
    this.quasiFriends = [];

    this.listenMQTTEvent();
  }

  // 改变好友列表唯一入口
  changeFriends(list:IFriendInfo[]) {
    this.friends = [...list];
    for (const info of list) {
      userSrv.cacheUserInfo(info);
    }
    ipcEvent.emit(EMainEventKey.MyFriendChange, this.friends);
  }

  // 改变准好友列表唯一入口
  changeQuasiFriends(list:IQuasiFriendSrv[]) {
    this.quasiFriends = list;
    ipcEvent.emit(EMainEventKey.QuasiFriendChange, this.quasiFriends);
  }

  /**
   * 获取我的好友，带缓存
   * */
  async getMyFriendList(): Promise<IFriendInfo[]> {
    if (this.friends.length === 0) {
      await this.myFriendList();
    }

    return this.friends;
  }

  /**
   * 获取我的准好友带缓存
   * */
  async getQuasiFriendList(): Promise<IQuasiFriendSrv[]> {
    if (this.quasiFriends.length === 0) {
      await this.quasiFriendList();
    }

    return this.quasiFriends;
  }

  /**
   * 转换为准好友结构
   * */
  toQuasiFriendSrv(item:IQuasiFriend):IQuasiFriendSrv {
    let [selfStatus, friendStatus] = [item.status.status1, item.status.status2];

    if (item.info.id === item.status.userID1) {
      [selfStatus, friendStatus] = [friendStatus, selfStatus];
    }

    return {
      info: item.info,
      status: item.status,
      selfStatus,
      friendStatus,
    };
  }

  // --------------------- 接口调用 ----------------------
  /**
   * 搜索指定用户信息
   * */
  async search(keywords:string):Promise<IFriendInfoSrv | undefined> {
    const friendInfo = await mqtt.friend.search(keywords);

    if (!friendInfo) {
      return undefined;
    }

    return {
      ...friendInfo,
      isFriend: false,
    };
  }

  /**
   * 获取我的好友，不带缓存
   * */
  async myFriendList(): Promise<IFriendInfo[]> {
    const list = await mqtt.friend.myFriendList();
    this.changeFriends(list);

    for (const friendInfo of list) {
      conversationSrv.updateWithUserInfo(friendInfo);
    }

    return list;
  }

  /**
   * 获取我的准好友，不带缓存
   * */
  async quasiFriendList(): Promise<IQuasiFriendSrv[]> {
    const list = await mqtt.friend.quasiFriendList();

    const newList = list.map((item) => this.toQuasiFriendSrv(item));
    this.changeQuasiFriends(newList);

    return newList;
  }

  /**
   * 添加好友
   * */
  async add(userId:string): Promise<unknown> {
    const userInfo = await userSrv.getUserInfo();
    return mqtt.friend.add({ formUserId: userInfo.id, toUserId: userId });
  }

  /**
   * 忽略对方添加
   * */
  async ignore(userId:string): Promise<unknown> {
    const userInfo = await userSrv.getUserInfo();
    return mqtt.friend.ignore({ formUserId: userInfo.id, toUserId: userId });
  }

  /**
   * 删除好友
   * */
  async remove(userId:string): Promise<unknown> {
    const userInfo = await userSrv.getUserInfo();
    return mqtt.friend.remove({ formUserId: userInfo.id, toUserId: userId });
  }
  // -------------------- 接口调用 -----------------------

  // -------------------- 事件监听 -----------------------
  private onFriendChange(friend:IQuasiFriend) {
    // 1.更新准好友
    const quasiFriendItem = this.toQuasiFriendSrv(friend);
    const quasiFriendList = this.quasiFriends;

    const index = quasiFriendList.findIndex((item) => item.info.id === quasiFriendItem.info.id);
    if (index !== -1) {
      // 更新
      quasiFriendList.splice(index, 1, quasiFriendItem);
    } else {
      // 添加
      quasiFriendList.unshift(quasiFriendItem);
    }
    if (quasiFriendItem.status.status1 === EFriendStatus.FriendUnsubscribe
      && quasiFriendItem.status.status2 === EFriendStatus.FriendUnsubscribe) {
      // 删除
      quasiFriendList.splice(index, 1);
    }
    quasiFriendList.sort((a, b) => a.status.updatedAt - b.status.updatedAt);

    this.changeQuasiFriends(quasiFriendList);

    // 2.更新好友列表
    const friendList = this.friends;
    const friendIndex = friendList.findIndex((item) => item.id === friend.info.id);
    if (friend.status.status1 === EFriendStatus.FriendSubscribe
      && friend.status.status2 === EFriendStatus.FriendSubscribe) {
      // 添加
      if (friendIndex === -1) {
        friendList.push(friend.info);
      } else {
        friendList.splice(friendIndex, 1, friend.info);
      }
      this.changeFriends(friendList);
    } else {
      // 删除
      if (friendIndex !== -1) {
        friendList.splice(friendIndex, 1);
        this.changeFriends(friendList);
      }
    }
  }
  // -------------------- 事件监听 -----------------------
}

export default new FriendSrv();
