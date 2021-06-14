import './moudule/a';
import './moudule/b';

import { ipcRenderer, contextBridge } from 'electron';

console.log(ipcRenderer.sendSync('synchronous-message', 'ping')); // prints "pong"

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector:any, text:any) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

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
