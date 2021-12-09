/* eslint-disable class-methods-use-this */
import ipcEvent from '@main/ipcMain/event';
import { EMainEventKey } from '@main/ipcMain/eventInterface';
import {
  IGroupInfo, IGroupMemberChangeParams, IFriendInfo,
} from '../modules/mqtt/interface';
import mqtt from '../modules/mqtt/index';
import userSrv from './userSrv';

export interface IGroupInfoSrv extends IGroupInfo{
  memberList:IFriendInfo[]
}

export interface IGroupSrv {
  getMyGroupList():Promise<IGroupInfoSrv[]>,
  myGroupList():Promise<IGroupInfoSrv[]>,
  create(params:IGroupInfo):Promise<unknown>
  remove(groupId:string):Promise<unknown>
  update(params:IGroupInfo):Promise<unknown>
  addMembers(params:IGroupMemberChangeParams):Promise<unknown>
  delMembers(params:IGroupMemberChangeParams):Promise<unknown>
  exit(params:IGroupMemberChangeParams):Promise<unknown>
}

class GroupSrv implements IGroupSrv {
  private groups:IGroupInfoSrv[];

  constructor() {
    this.groups = [];
    this.initEvent();
  }

  // 改变群列表唯一入口
  changeGroups(list:IGroupInfoSrv[]) {
    this.groups = [...list];
    ipcEvent.emit(EMainEventKey.MyGroupChange, list);
  }

  async getMyGroupList():Promise<IGroupInfoSrv[]> {
    if (this.groups.length === 0) {
      await this.myGroupList();
    }

    return this.groups;
  }

  async toGroupInfoSrv(info:IGroupInfo):Promise<IGroupInfoSrv> {
    const item:IGroupInfoSrv = {
      ...info,
      memberList: [],
    };

    for (const memberID of info.MemberIDs) {
      // eslint-disable-next-line no-await-in-loop
      const memberInfo = await userSrv.getCacheUserInfo(memberID);
      item.memberList.push(memberInfo);
    }

    return item;
  }

  // ======================= 接口 ============================
  async myGroupList():Promise<IGroupInfoSrv[]> {
    const resultList = [];

    const list = await mqtt.group.myGroupList();
    for (const groupItem of list) {
      // eslint-disable-next-line no-await-in-loop
      const item = await this.toGroupInfoSrv(groupItem);
      resultList.push(item);
    }
    this.changeGroups(resultList);
    // 监听事件
    this.initEvent();

    return resultList;
  }

  async create(params:IGroupInfo):Promise<unknown> {
    return mqtt.group.create(params);
  }

  async remove(groupId:string):Promise<unknown> {
    return mqtt.group.remove(groupId);
  }

  async update(params:IGroupInfo):Promise<unknown> {
    return mqtt.group.update(params);
  }

  async addMembers(params:IGroupMemberChangeParams):Promise<unknown> {
    return mqtt.group.addMembers(params);
  }

  async delMembers(params:IGroupMemberChangeParams):Promise<unknown> {
    return mqtt.group.delMembers(params);
  }

  async exit(params:IGroupMemberChangeParams):Promise<unknown> {
    return mqtt.group.exit(params);
  }
  // ======================= 接口 ============================

  // ======================= 事件监听 ========================
  initEvent() {
    mqtt.group.onGroupCreate(this.onGroupCreate.bind(this));
    mqtt.group.onGroupDelete(this.onGroupDelete.bind(this));
    mqtt.group.onGroupUpdate(this.onGroupUpdate.bind(this));
    mqtt.group.onGroupAddMembers(this.onGroupAddMembers.bind(this));
    mqtt.group.onGroupDelMembers(this.onGroupDelMembers.bind(this));
    mqtt.group.onGroupExit(this.onGroupExit.bind(this));
  }

  async onGroupCreate(info:IGroupInfo) {
    const groupItem = await this.toGroupInfoSrv(info);
    const index = this.groups.findIndex((item) => item.id === groupItem.id);
    if (index !== -1) {
      this.groups.splice(index, 1, groupItem);
    } else {
      this.groups.push(groupItem);
    }

    this.changeGroups(this.groups);
  }

  onGroupDelete(info:IGroupInfo) {
    const index = this.groups.findIndex((item) => item.id === info.id);
    if (index !== -1) {
      this.groups.splice(index, 1);
      this.changeGroups(this.groups);
    }
  }

  async onGroupUpdate(info:IGroupInfo) {
    const groupItem = await this.toGroupInfoSrv(info);
    const index = this.groups.findIndex((item) => item.id === groupItem.id);
    if (index !== -1) {
      this.groups.splice(index, 1, groupItem);
    } else {
      this.groups.push(groupItem);
    }

    this.changeGroups(this.groups);
  }

  async onGroupAddMembers(params:IGroupMemberChangeParams) {
    const groupItem = this.groups.find((item) => item.id === params.groupId);
    if (!groupItem) {
      return;
    }

    const ids = new Set(groupItem.MemberIDs);
    for (const iterator of params.list) {
      ids.add(iterator.id);
    }
    groupItem.MemberIDs = Array.from(ids);
    groupItem.memberList = [];

    for (const memberID of groupItem.MemberIDs) {
      // eslint-disable-next-line no-await-in-loop
      const memberInfo = await userSrv.getCacheUserInfo(memberID);
      groupItem.memberList.push(memberInfo);
    }

    this.changeGroups(this.groups);
  }

  async onGroupDelMembers(params:IGroupMemberChangeParams) {
    const groupItem = this.groups.find((item) => item.id === params.groupId);
    if (!groupItem) {
      return;
    }

    const ids:string[] = [];
    for (const id of groupItem.MemberIDs) {
      if (params.list.findIndex((item) => item.id === id) === -1) {
        ids.push(id);
      }
    }
    groupItem.MemberIDs = ids;
    groupItem.memberList = [];

    for (const memberID of groupItem.MemberIDs) {
      // eslint-disable-next-line no-await-in-loop
      const memberInfo = await userSrv.getCacheUserInfo(memberID);
      groupItem.memberList.push(memberInfo);
    }

    this.changeGroups(this.groups);
  }

  onGroupExit(params:IGroupMemberChangeParams) {
    const index = this.groups.findIndex((item) => item.id === params.groupId);
    if (index !== -1) {
      this.groups.splice(index, 1);
      this.changeGroups(this.groups);
    }
  }
  // ======================= 事件监听 ========================
}

export default new GroupSrv();
