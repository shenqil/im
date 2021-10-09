import { ipcRenderer, contextBridge } from 'electron';
import {
  v4 as uuidv4,
} from 'uuid';

const eventMap:Map<string, Function> = new Map();

ipcRenderer.on('mainBridgeEvent--succee', (_, args) => {
  const callBack = eventMap.get(args.id);
  eventMap.delete(args.id);
  if (callBack) {
    callBack(null, args.result);
  }
});

ipcRenderer.on('mainBridgeEvent--error', (_, args) => {
  const callBack = eventMap.get(args.id);
  eventMap.delete(args.id);
  if (callBack) {
    callBack(args.error);
  }
});

contextBridge.exposeInMainWorld('mainBridgeCall', (params:any, callBack:Function) => {
  const id = uuidv4();
  eventMap.set(id, callBack);
  ipcRenderer.send('mainBridgeEvent', {
    id,
    ...params,
  });
});
