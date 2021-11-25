import { ipcRenderer, contextBridge } from 'electron';

const eventMap:Map<string, Array<Function>> = new Map();

contextBridge.exposeInMainWorld('mainEvent', {
  on(name: string, callBack: Function): void {
    const fns = eventMap.get(name) || [];
    if (fns.findIndex((fn) => fn === callBack) !== -1) {
      return;
    }

    fns.push(callBack);

    eventMap.set(name, fns);

    // 通知主进程订阅
    ipcRenderer.send('mainEvent', { name, type: 'on' });
  },
  off(name: string, callBack: Function): void {
    const fns = eventMap.get(name) || [];
    const index = fns.findIndex((fn) => fn === callBack);
    if (index === -1) {
      return;
    }

    fns.splice(index, 1);

    eventMap.set(name, fns);

    // 通知主进程取消订阅
    if (fns.length === 0) {
      ipcRenderer.send('mainEvent', { name, type: 'off' });
    }
  },
  emit(name: string, params: unknown):void {
    // 发布一条消息
    ipcRenderer.send('mainEvent', { name, type: 'emit', params });
  },
});

ipcRenderer.on('mainEvent--emit', (_, { name, params }) => {
  const fns = eventMap.get(name) || [];

  try {
    fns.forEach((fn) => fn.apply(params));
  } catch (error) {
    console.error(error);
  }
});
