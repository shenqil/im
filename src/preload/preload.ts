import './moudule/a';
import './moudule/b';

import { ipcRenderer, contextBridge } from 'electron';

console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"

contextBridge.exposeInMainWorld('myAPI', {
  openHlepWin() {
    console.log('openHelpWin');
    ipcRenderer.send('openHelpWin');
  },
  openAboutWin() {
    console.log('openAboutWin');
    ipcRenderer.send('openAboutWin');
  },
});
