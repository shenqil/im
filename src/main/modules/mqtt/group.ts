import { EEventName } from '@main/modules/mqtt/enum';
import connect from './connect';

export interface IGroupInfo {
  id :string
  groupName: string
  brief : string
  avatar : string
  owner : string
  creator: string
  createdAt ?:number
  memberIDs: string []
}

export interface IGroupMemberInfo{
  id:string,
  name:string
}

export interface IGroupMemberChangeParams {
  fromId:string,
  fromName:string,
  groupId:string,
  list:IGroupMemberInfo[]
}

export interface IGroup {
  myGroupList():Promise<IGroupInfo[]>,
  create(params:IGroupInfo):Promise<unknown>,
  remove(groupId:string):Promise<unknown>,
  update(params:IGroupInfo):Promise<unknown>,
  addMembers(params:IGroupMemberChangeParams):Promise<unknown>,
  delMembers(params:IGroupMemberChangeParams):Promise<unknown>,
  exit(params:IGroupMemberChangeParams):Promise<unknown>,
  onGroupCreate(callback:Function):void,
  onGroupDelete(callback:Function):void,
  onGroupAddMembers(callback:Function):void,
  onGroupDelMembers(callback:Function):void,
  onGroupUpdate(callback:Function):void,
  onGroupExit(callback:Function):void
}

/**
 * 查询我的群组
 * */
async function myGroupList():Promise<IGroupInfo[]> {
  const res = await connect.sendMsgWaitReply({
    topic: 'group/query',
    message: Date.now().toString(),
    opts: {
      qos: 0,
      retain: false,
    },
  }) as string;

  if (res === 'null') {
    return [];
  }

  const { Data } = JSON.parse(res);

  return Data || [];
}

/**
 * 创建一个群组
 * */
async function create(params:IGroupInfo):Promise<unknown> {
  return connect.sendMsgWaitReply({
    topic: 'group/create',
    message: JSON.stringify(params),
    opts: {
      qos: 0,
      retain: false,
    },
  });
}

/**
 * 群主删除一个群
 * */
async function remove(groupId:string):Promise<unknown> {
  return connect.sendMsgWaitReply({
    topic: 'group/delete',
    message: groupId,
    opts: {
      qos: 0,
      retain: false,
    },
  });
}

/**
 * 群主更新群信息
 * */
async function update(params:IGroupInfo):Promise<unknown> {
  return connect.sendMsgWaitReply({
    topic: 'group/update',
    message: JSON.stringify(params),
    opts: {
      qos: 0,
      retain: false,
    },
  });
}

/**
 * 添加群成员
 * */
async function addMembers(params:IGroupMemberChangeParams):Promise<unknown> {
  return connect.sendMsgWaitReply({
    topic: 'group/addMembers',
    message: JSON.stringify(params),
    opts: {
      qos: 0,
      retain: false,
    },
  });
}

/**
 * 删除群成员
 * */
async function delMembers(params:IGroupMemberChangeParams):Promise<unknown> {
  return connect.sendMsgWaitReply({
    topic: 'group/delMembers',
    message: JSON.stringify(params),
    opts: {
      qos: 0,
      retain: false,
    },
  });
}

/**
 * 成员退出群组
 * */
async function exit(params:IGroupMemberChangeParams):Promise<unknown> {
  return connect.sendMsgWaitReply({
    topic: 'group/exitGroup',
    message: JSON.stringify(params),
    opts: {
      qos: 0,
      retain: false,
    },
  });
}

/**
 * 监听事件
 * */
function onGroupCreate(callback:Function) {
  connect.listen(EEventName.groupCreate, callback);
}

function onGroupDelete(callback:Function) {
  connect.listen(EEventName.groupDelete, callback);
}

function onGroupAddMembers(callback:Function) {
  connect.listen(EEventName.groupAddMembers, callback);
}

function onGroupDelMembers(callback:Function) {
  connect.listen(EEventName.groupDelMembers, callback);
}

function onGroupUpdate(callback:Function) {
  connect.listen(EEventName.groupUpdate, callback);
}

function onGroupExit(callback:Function) {
  connect.listen(EEventName.groupExitGroup, callback);
}

export default {
  myGroupList,
  create,
  remove,
  update,
  addMembers,
  delMembers,
  exit,
  onGroupCreate,
  onGroupDelete,
  onGroupAddMembers,
  onGroupDelMembers,
  onGroupUpdate,
  onGroupExit,
};
