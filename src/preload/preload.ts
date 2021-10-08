import { ipcRenderer, contextBridge } from 'electron';
import './moudule/mainBridge';

contextBridge.exposeInMainWorld('myAPI', {
  openHlepWin() {
    ipcRenderer.send('openHelpWin');
  },
  openAboutWin() {
    ipcRenderer.send('openAboutWin');
  },
});
