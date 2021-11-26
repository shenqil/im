/* eslint-disable class-methods-use-this */
import { IFriendInfo, IQuasiFriend } from '../modules/mqtt/interface';
import mqtt from '../modules/mqtt/index';
import userSrv from './userSrv';

export interface IFriendInfoSrv extends IFriendInfo{
  isFriend:boolean
}

export interface IFriendSrv {
  search(keywords:string):Promise<IFriendInfoSrv | undefined>
  myFriendList():Promise<Array<IFriendInfo>>
  quasiFriendList():Promise<Array<IQuasiFriend>>
  add(userId:string):Promise<unknown>
  ignore(userId:string):Promise<unknown>
  remove(userId:string):Promise<unknown>
}

class FriendSrv implements IFriendSrv {
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

  myFriendList(): Promise<IFriendInfo[]> {
    return mqtt.friend.myFriendList();
  }

  quasiFriendList(): Promise<IQuasiFriend[]> {
    return mqtt.friend.quasiFriendList();
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
}

export default new FriendSrv();
