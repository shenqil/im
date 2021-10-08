import { ipcMain } from 'electron';
import mqttSev from '../server/mqtt/index';

const modules:any = {
  mqtt: mqttSev,
};

ipcMain.on('mainBridgeEvent', async (event, { id, keys, args }) => {
  try {
    const result = await keys.reduce((pre:any, cur:any) => pre[cur], modules)(args);
    event.reply('mainBridgeEvent--succee', {
      id, result,
    });
  } catch (error) {
    event.reply('mainBridgeEvent--error', {
      id, error,
    });
  }
});
