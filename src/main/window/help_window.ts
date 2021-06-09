import { BrowserWindow,ipcMain } from 'electron';
import { resolve } from 'path'


let helpWindow:BrowserWindow;
const createWindow = (): void => {
    if(helpWindow){
        return
    }
    // Create the browser window.
    helpWindow = new BrowserWindow({
      height: 600,
      width: 800
    });
  
    // and load the index.html of the app.
    if(process.env.WEBPACK_DEV_SERVER_URL){
        helpWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'help_window.html');
    }else{
        helpWindow.loadURL(resolve(__dirname,'./renderer/help_window.html'));
    }
  
  
    // Open the DevTools.
    helpWindow.webContents.openDevTools();
  };
  
ipcMain.on('openHelpWin',()=>{
    createWindow()
})
  