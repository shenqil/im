/* eslint-disable class-methods-use-this */
import { IFriendInfo, IQuasiFriend, EFriendStatus } from '../modules/mqtt/interface';
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
  }

  // 改变好友列表唯一入口
  changeFriends(list:IFriendInfo[]) {
    this.friends = [...list];
  }

  // 改变准好友列表唯一入口
  changeQuasiFriends(list:IQuasiFriendSrv[]) {
    this.quasiFriends = list;
  }

  async getMyFriendList(): Promise<IFriendInfo[]> {
    if (this.friends.length === 0) {
      await this.myFriendList();
    }

    return this.friends;
  }

  async getQuasiFriendList(): Promise<IQuasiFriendSrv[]> {
    if (this.quasiFriends.length === 0) {
      await this.quasiFriendList();
    }

    return this.quasiFriends;
  }

  // --------------------- 接口调用 ----------------------
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

  async myFriendList(): Promise<IFriendInfo[]> {
    const list = await mqtt.friend.myFriendList();
    this.changeFriends(list);
    return list;
  }

  async quasiFriendList(): Promise<IQuasiFriendSrv[]> {
    const list = await mqtt.friend.quasiFriendList();

    const newList = list.map((item) => {
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
    });
    this.changeQuasiFriends(newList);
    return newList;
  }

  async add(userId:string): Promise<unknown> {
    const userInfo = await userSrv.getUserInfo();
    return mqtt.friend.add({ formUserId: userInfo.id, toUserId: userId });
  }

  async ignore(userId:string): Promise<unknown> {
    const userInfo = await userSrv.getUserInfo();
    return mqtt.friend.ignore({ formUserId: userInfo.id, toUserId: userId });
  }

  async remove(userId:string): Promise<unknown> {
    const userInfo = await userSrv.getUserInfo();
    return mqtt.friend.remove({ formUserId: userInfo.id, toUserId: userId });
  }
  // -------------------- 接口调用 -----------------------
}

export default new FriendSrv();
