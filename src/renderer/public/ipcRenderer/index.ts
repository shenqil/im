import IMainBridge from '../../../main/ipcMain/interface';

const { mainBridgeCall } = (window as any);

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
