import { ipcMain, BrowserWindow } from 'electron';
import { EMainEventKey } from './eventInterface';

const callbackMap:Map<string, Array<Function>> = new Map();

/**
 * 事件中心
 * */
class MainEvent {
  private eventMap:Map<EMainEventKey, number[]>;

  constructor() {
    this.eventMap = new Map();
  }

  emit(name: EMainEventKey, params: unknown): void {
    // 1、处理其他进程的事件
    const ids = this.eventMap.get(name) || [];

    // 1.1拿到所有相关的窗口
    const allWins = BrowserWindow.getAllWindows()
      .filter((win) => ids.findIndex((id) => id === win.webContents.getProcessId()) !== -1);

    // 1.2派发事件
    const nIds = allWins.map((win) => {
      win.webContents.send('mainEvent--emit', { name, params });
      return win.webContents.getProcessId();
    });
    // 1.3保存存在的id
    this.eventMap.set(name, nIds);

    // 2、处理主进程事件
    const fns = callbackMap.get(name) || [];
    fns.forEach((fn) => fn(params));
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

// -------------------主进程调用方法-------------------

function on(name: EMainEventKey, callBack: Function) {
  const fns = callbackMap.get(name) || [];
  if (fns.findIndex((fn) => fn === callBack) !== -1) {
    return;
  }

  fns.push(callBack);

  callbackMap.set(name, fns);
}

function off(name: EMainEventKey, callBack: Function) {
  const fns = callbackMap.get(name) || [];
  const index = fns.findIndex((fn) => fn === callBack);
  if (index === -1) {
    return;
  }

  fns.splice(index, 1);

  callbackMap.set(name, fns);
}

function emit(name: EMainEventKey, params: unknown) {
  mainEvent.emit(name, params);
}
// -------------------主进程调用方法-------------------
export default {
  on,
  off,
  emit,
};
