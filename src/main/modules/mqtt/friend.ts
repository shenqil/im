import connect from './connect';

export interface IFriendInfo {
  id: string,
  avatar:string,
  userName: string,
  realName: string,
}

export interface IFriend {
  fetchList():Promise<IFriendInfo>
  add():Promise<unknown>
  remove():Promise<unknown>
}
export default connect;
