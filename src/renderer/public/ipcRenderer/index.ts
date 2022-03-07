import IMainBridge from '@main/ipcMain/interface';
import { EMainEventKey } from '@main/ipcMain/eventInterface';

const { mainBridgeCall } = (window as any);

// -------------------------- js 桥 start ------------------
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
        mainBridgeCall({
          keys: target.keys,
          args,
        }, (error:any, result:any) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    },
  }) as any;

  return obj;
}

export const mainBridge = new Proxy({}, {
  get(_, key) {
    return NewProxy(key);
  },
}) as IMainBridge;

export default IMainBridge;
// -------------------------- js 桥 end ------------------

// -------------------------- 事件中心 start --------------
interface IMainEvent{
  on(name: EMainEventKey, callBack: Function):void,
  off(name: EMainEventKey, callBack: Function): void,
  emit(name: EMainEventKey, params: unknown):void,
}
export * from '@main/ipcMain/eventInterface';
export const mainEvent = (window as any).mainEvent as IMainEvent;
// -------------------------- 事件中心 end ----------------
