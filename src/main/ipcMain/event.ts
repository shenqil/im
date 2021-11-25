import { ipcMain, BrowserWindow } from 'electron';
import { EMainEventKey } from './eventInterface';

interface IMainEvent {
  on(name: EMainEventKey, processId: number): void
  off(name: EMainEventKey, processId: number): void
  emit(name:EMainEventKey, params:unknown):void
}

/**
 * 事件中心
 * */
class MainEvent implements IMainEvent {
  private eventMap:Map<EMainEventKey, number[]>;

  constructor() {
    this.eventMap = new Map();
  }

  emit(name: EMainEventKey, params: unknown): void {
    let ids = this.eventMap.get(name) || [];

    // 拿到所有相关的窗口
    const allWins = BrowserWindow.getAllWindows()
      .filter((win) => ids.findIndex((id) => id === win.webContents.getProcessId()) !== -1);

    // 派发事件
    ids = allWins.map((win) => {
      win.webContents.send('mainEvent--emit', { name, params });
      return win.webContents.getProcessId();
    });

    // 保存存在的id
    this.eventMap.set(name, ids);
  }

  off(name: EMainEventKey, processId: number): void {
    const ids = this.eventMap.get(name) || [];
    // 不存在
    const index = ids.findIndex((id) => id === processId);
    if (index === -1) {
      return;
    }

    ids.splice(index, 1);

    this.eventMap.set(name, ids);
  }

  on(name: EMainEventKey, processId: number): void {
    const ids = this.eventMap.get(name) || [];
    // 已存在
    if (ids.findIndex((id) => id === processId) !== -1) {
      return;
    }

    ids.push(processId);

    this.eventMap.set(name, ids);
  }
}

const mainEvent = new MainEvent();

ipcMain.on('mainEvent', (event, { name, type, params }) => {
  switch (type) {
    case 'on':
      mainEvent.on(name, event.processId);
      break;
    case 'off':
      mainEvent.off(name, event.processId);
      break;
    case 'emit':
      mainEvent.emit(name, params);
      break;
    default:
      break;
  }
});

export default mainEvent;
