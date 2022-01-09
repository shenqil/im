/* eslint-disable class-methods-use-this */
import ipcEvent from '@main/ipcMain/event';
import { EMainEventKey } from '@main/ipcMain/eventInterface';
import conversationSrv from '@main/server/conversationSrv';
import {
  IGroupInfo, IGroupMemberChangeParams,
} from '../modules/mqtt/interface';
import mqtt from '../modules/mqtt/index';

export interface IGroupSrv {
  getMyGroupList():Promise<IGroupInfo[]>,
  myGroupList():Promise<IGroupInfo[]>,
  create(params:IGroupInfo):Promise<unknown>
  remove(groupId:string):Promise<unknown>
  update(params:IGroupInfo):Promise<unknown>
  addMembers(params:IGroupMemberChangeParams):Promise<unknown>
  delMembers(params:IGroupMemberChangeParams):Promise<unknown>
  exit(params:IGroupMemberChangeParams):Promise<unknown>
}

class GroupSrv implements IGroupSrv {
  private groups:IGroupInfo[];

  constructor() {
    this.groups = [];
    this.initEvent();
  }

  // 改变群列表唯一入口
  changeGroups(list:IGroupInfo[]) {
    this.groups = [...list];
    ipcEvent.emit(EMainEventKey.MyGroupChange, list);
  }

  async getMyGroupList():Promise<IGroupInfo[]> {
    if (this.groups.length === 0) {
      await this.myGroupList();
    }

    return this.groups;
  }

  // ======================= 接口 ============================
  async myGroupList():Promise<IGroupInfo[]> {
    const list = await mqtt.group.myGroupList();
    // 更新会话
    for (const groupItem of list) {
      conversationSrv.updateWithGroupInfo(groupItem);
    }

    this.changeGroups(list);
    // 监听事件
    this.initEvent();

    return list;
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

  async onGroupCreate(groupItem:IGroupInfo) {
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

  async onGroupUpdate(groupItem:IGroupInfo) {
    const index = this.groups.findIndex((item) => item.id === groupItem.id);
    if (index !== -1) {
      this.groups.splice(index, 1, groupItem);
      conversationSrv.updateWithGroupInfo(groupItem);
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

    const ids = new Set(groupItem.memberIDs);
    for (const iterator of params.list) {
      ids.add(iterator.id);
    }
    groupItem.memberIDs = Array.from(ids);

    this.changeGroups(this.groups);
  }

  async onGroupDelMembers(params:IGroupMemberChangeParams) {
    const groupItem = this.groups.find((item) => item.id === params.groupId);
    if (!groupItem) {
      return;
    }

    const ids:string[] = [];
    for (const id of groupItem.memberIDs) {
      if (params.list.findIndex((item) => item.id === id) === -1) {
        ids.push(id);
      }
    }
    groupItem.memberIDs = ids;

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
