/* eslint-disable class-methods-use-this */
import { ipcMain, BrowserWindow } from 'electron';
import { EMainEventKey } from './eventInterface';

const paramsMap:Map<EMainEventKey, unknown> = new Map();
const callbackMap:Map<string, Array<Function>> = new Map();
const processMap:Map<EMainEventKey, number[]> = new Map();

function clearParamsMap(name:EMainEventKey) {
  const fns = callbackMap.get(name) || [];
  const ids = processMap.get(name) || [];

  if (fns.length + ids.length === 0) {
    paramsMap.delete(name);
  }
}

/**
 * 事件中心
 * */
class MainEvent {
  emit(name: EMainEventKey, params: unknown): void {
    // 1、处理其他进程的事件
    const ids = processMap.get(name) || [];

    // 1.1拿到所有相关的窗口
    const allWins = BrowserWindow.getAllWindows()
      .filter((win) => ids.findIndex((id) => id === win.webContents.getProcessId()) !== -1);

    // 1.2派发事件
    const nIds = allWins.map((win) => {
      win.webContents.send('mainEvent--emit', { name, params });
      return win.webContents.getProcessId();
    });
    // 1.3保存存在的id
    processMap.set(name, nIds);

    // 2、处理主进程事件
    const fns = callbackMap.get(name) || [];
    fns.forEach((fn) => fn(params));

    // 3、保存最后一次数据
    paramsMap.set(name, params);
  }

  off(name: EMainEventKey, processId: number): void {
    const ids = processMap.get(name) || [];
    // 不存在
    const index = ids.findIndex((id) => id === processId);
    if (index === -1) {
      return;
    }

    ids.splice(index, 1);

    processMap.set(name, ids);

    clearParamsMap(name);
  }

  on(name: EMainEventKey, processId: number): void {
    const ids = processMap.get(name) || [];
    // 已存在
    if (ids.findIndex((id) => id === processId) !== -1) {
      return;
    }

    ids.push(processId);

    processMap.set(name, ids);
  }
}

const mainEvent = new MainEvent();

ipcMain.on('mainEvent', (event, { name, type, params }) => {
  switch (type) {
    case 'on': {
      mainEvent.on(name, event.processId);
      // 监听返回一次数据
      const dataParams = paramsMap.get(name);
      if (dataParams !== undefined) {
        event.reply('mainEvent--emit', { name, params: dataParams });
      }
      break;
    }

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

  // 调用一次
  if (paramsMap.get(name) !== undefined) {
    callBack(paramsMap.get(name));
  }
}

function off(name: EMainEventKey, callBack: Function) {
  const fns = callbackMap.get(name) || [];
  const index = fns.findIndex((fn) => fn === callBack);
  if (index === -1) {
    return;
  }

  fns.splice(index, 1);

  callbackMap.set(name, fns);

  clearParamsMap(name);
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
