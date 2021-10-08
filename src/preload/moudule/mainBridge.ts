import { ipcRenderer, contextBridge } from 'electron';
import {
  v4 as uuidv4,
} from 'uuid';

const eventMap:Map<string, Array<any>> = new Map();

function NewProxy(key:any) {
  const a = () => {};
  a.keys = [key];
  const obj = new Proxy(a, {
    get(target, k) {
      target.keys.push(k);
      return obj;
    },
    apply(target, _, args) {
      return new Promise((resolve, reject) => {
        const id = uuidv4();
        ipcRenderer.send('mainBridgeEvent', {
          id,
          keys: target.keys,
          args,
        });

        eventMap.set(id, [resolve, reject]);
      });
    },
  }) as any;

  return obj;
}

ipcRenderer.on('mainBridgeEvent--succee', (_, args) => {
  if (eventMap.has(args.id)) {
    const [resolve] = eventMap.get(args.id) || [];
    eventMap.delete(args.id);
    resolve(args.result);
  }
});

ipcRenderer.on('mainBridgeEvent--error', (_, args) => {
  if (eventMap.has(args.id)) {
    const [, reject] = eventMap.get(args.id) || [];
    eventMap.delete(args.id);
    reject(args.error);
  }
});

contextBridge.exposeInMainWorld('mainBridge', new Proxy({}, {
  get(_, key) {
    return NewProxy(key);
  },
}));
