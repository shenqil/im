import { IFriendInfoSrv } from '@main/server/interface';
import { screen } from 'electron';
import BaseWIN, { IBaseWIN } from './base';
import mainWin from './main_window';
import { centerPoint } from './utils';

export interface IBusinessCardClick {
  x:number,
  y:number
}

export interface IBusinessCardParams{
  point?:IBusinessCardClick
  isCursorPoint?:boolean
  friendInfo:IFriendInfoSrv
}

export interface IBusinessCardWindow extends IBaseWIN {
  show(params:IBusinessCardParams):void
  getFriendInfo():Promise<IFriendInfoSrv>
}
export class BusinessCardWindow extends BaseWIN implements IBusinessCardWindow {
  private friendInfo:IFriendInfoSrv;

  private position:IBusinessCardClick;

  constructor(name: string) {
    super(name);
    this.position = {
      x: 0,
      y: 0,
    };

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
      width: 300,
      height: 300,
      x: this.position.x,
      y: this.position.y,
      resizable: false,
      frame: false,
      parent: mainWin.win || undefined,
    });

    this.win?.once('ready-to-show', () => {
      this.win?.show();
      this.win?.on('blur', () => {
        this.win?.hide();
      });
    });
  }

  show(params:IBusinessCardParams) {
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
      const [x, y] = centerPoint(300, 300);
      this.position = {
        x, y,
      };
    }

    // 窗口不存在则创建
    if (!this.win) {
      this.openWin();
    } else {
      this.win.setPosition(this.position.x, this.position.y);
      this.win.show();
    }
  }

  async getFriendInfo() {
    return this.friendInfo;
  }
}

export default new BusinessCardWindow('businessCard_window');
