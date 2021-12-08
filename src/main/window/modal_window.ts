import { IFriendInfoSrv } from '@main/server/interface';
import { screen } from 'electron';
import ipcMainEvent from '@main/ipcMain/event';
import { EMainEventKey } from '@main/ipcMain/eventInterface';
import BaseWIN, { IBaseWIN } from './base';
import mainWin from './main_window';
import { centerPoint } from './utils';

export interface IModalClick {
  x:number,
  y:number
}

export interface IBusinessCardParams{
  point?:IModalClick
  isCursorPoint?:boolean
  friendInfo:IFriendInfoSrv
}

export interface IModalWindow extends IBaseWIN {
  hidden():void

  showBusinessCard(params:IBusinessCardParams):void
  getFriendInfo():Promise<IFriendInfoSrv>

  showAddFriend():void
}
export class ModalWindow extends BaseWIN implements IModalWindow {
  // 公共
  private position:IModalClick; // 显示位置

  private width:number; // 宽度

  private height:number; // 高度

  private routePath:string; // 路由路径

  // 名片专用
  private friendInfo:IFriendInfoSrv;

  constructor(name: string) {
    super(name);
    this.position = {
      x: 0,
      y: 0,
    };

    this.width = 300;
    this.height = 300;
    this.routePath = '/';

    this.friendInfo = {
      id: '',
      avatar: '',
      userName: '',
      realName: '',
      phone: '',
      email: '',
      isFriend: false,
    };
  }

  openWin() {
    if (!mainWin.win) {
      return;
    }
    super.openWin({
      show: false,
      width: this.width,
      height: this.height,
      x: this.position.x,
      y: this.position.y,
      resizable: false,
      frame: false,
      parent: mainWin.win || undefined,
    });

    this.win?.once('ready-to-show', () => {
      ipcMainEvent.emit(EMainEventKey.ModalRouteChange, this.routePath);
      this.win?.on('blur', () => {
        this.win?.hide();
      });
    });
  }

  private show() {
    // 窗口不存在则创建
    if (!this.win) {
      this.openWin();
    } else {
      this.win.setContentBounds({
        x: this.position.x,
        y: this.position.y,
        width: this.width,
        height: this.height,
      });
      ipcMainEvent.emit(EMainEventKey.ModalRouteChange, this.routePath);
    }
  }

  hidden() {
    this.win?.hide();
  }

  // ---------------------------- 名片弹窗逻辑 -----------------------------------------
  /**
   * 显示名片
   * */
  showBusinessCard(params:IBusinessCardParams) {
    this.routePath = '/businessCard';
    this.width = 300;
    this.height = 300;

    // 缓存传入的数据
    this.friendInfo = params.friendInfo;

    // 计算名片显示的位置
    if (params.point) {
      this.position = {
        x: params.point.x,
        y: params.point.y,
      };
    } else if (params.isCursorPoint) {
      const point = screen.getCursorScreenPoint();
      this.position = {
        x: point.x,
        y: point.y,
      };
    } else {
      const [x, y] = centerPoint(this.width, this.height);
      this.position = {
        x, y,
      };
    }

    this.show();
  }

  async getFriendInfo() {
    return this.friendInfo;
  }
  // ---------------------------- 名片弹窗逻辑 -----------------------------------------

  // ---------------------------- 添加好友弹窗逻辑--------------------------------------
  /**
   * 显示添加好友
   * */
  showAddFriend() {
    this.routePath = '/addFriend';
    this.width = 422;
    this.height = 180;

    // 计算位置
    const [x, y] = centerPoint(this.width, this.height);
    this.position = {
      x, y,
    };

    this.show();
  }
  // ---------------------------- 添加好友弹窗逻辑--------------------------------------
}

export default new ModalWindow('modal_window');
