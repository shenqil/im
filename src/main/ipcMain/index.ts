import { ipcMain } from 'electron';
import mqttSev from '../server/mqtt/index';

const modules:any = {
  mqtt: mqttSev,
};

ipcMain.on('mainBridgeEvent', async (event, { id, keys, args }) => {
  try {
    const [self, callBack] = keys.reduce(
      ([,pre]:any, cur:any) => [pre, pre[cur]], [modules, modules],
    );

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
