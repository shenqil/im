/* eslint-disable class-methods-use-this */
import { IFriendInfo, IFriendOperateParam } from '../modules/mqtt/interface';
import mqtt from '../modules/mqtt/index';

export interface IFriendInfoSrv extends IFriendInfo{
  isFriend:boolean
}

export interface IFriendSrv {
  search(keywords:string):Promise<IFriendInfoSrv | undefined>
  fetchList():Promise<Array<IFriendInfo>>
  add(params:IFriendOperateParam):Promise<unknown>
  remove(params:IFriendOperateParam):Promise<unknown>
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

  async fetchList():Promise<Array<IFriendInfo>> {
    return mqtt.friend.fetchList();
  }

  add(params:IFriendOperateParam): Promise<unknown> {
    return mqtt.friend.add(params);
  }

  remove(params:IFriendOperateParam): Promise<unknown> {
    return mqtt.friend.remove(params);
  }
}

export default new FriendSrv();
