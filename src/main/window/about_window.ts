import { BrowserWindow,ipcMain } from 'electron';
import { resolve } from 'path'


let aboutWindow:BrowserWindow;
const createWindow = (): void => {
    if(aboutWindow){
        return
    }
    // Create the browser window.
    aboutWindow = new BrowserWindow({
      height: 600,
      width: 800
    });
  
    // and load the index.html of the app.
    if(process.env.WEBPACK_DEV_SERVER_URL){
        aboutWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    }else{
        aboutWindow.loadURL(resolve(__dirname,'../about_window/index.html'));
    }
  
  
    // Open the DevTools.
    aboutWindow.webContents.openDevTools();
};


ipcMain.on('openAboutWin',()=>{
    createWindow()
})
  