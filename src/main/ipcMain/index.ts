import { ipcMain } from 'electron';
import server from '../server';
import wins from '../window';

const modules:any = {
  server,
  wins,
};

ipcMain.on('mainBridgeEvent', async (event, { id, keys, args }) => {
  try {
    // eslint-disable-next-line max-len
    const [self, callBack] = keys.reduce(([,pre]:any, cur:any) => [pre, pre[cur]], [modules, modules]);

    const result = await callBack.apply(self, args);
    event.reply('mainBridgeEvent--succee', {
      id, result,
    });
  } catch (error) {
    event.reply('mainBridgeEvent--error', {
      id, error,
    });
  }
});
