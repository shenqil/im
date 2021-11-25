/* eslint-disable class-methods-use-this */
import { IFriendInfo, IFriendOperateParam, IQuasiFriend } from '../modules/mqtt/interface';
import mqtt from '../modules/mqtt/index';

export interface IFriendInfoSrv extends IFriendInfo{
  isFriend:boolean
}

export interface IFriendSrv {
  search(keywords:string):Promise<IFriendInfoSrv | undefined>
  myFriendList():Promise<Array<IFriendInfo>>
  quasiFriendList():Promise<Array<IQuasiFriend>>
  add(params:IFriendOperateParam):Promise<unknown>
  ignore(params:IFriendOperateParam):Promise<unknown>
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

  myFriendList(): Promise<IFriendInfo[]> {
    return mqtt.friend.myFriendList();
  }

  quasiFriendList(): Promise<IQuasiFriend[]> {
    return mqtt.friend.quasiFriendList();
  }

  add(params:IFriendOperateParam): Promise<unknown> {
    return mqtt.friend.add(params);
  }

  ignore(params: IFriendOperateParam): Promise<unknown> {
    return mqtt.friend.ignore(params);
  }

  remove(params:IFriendOperateParam): Promise<unknown> {
    return mqtt.friend.remove(params);
  }
}

export default new FriendSrv();
