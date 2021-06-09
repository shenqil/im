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
      width: 800,
      webPreferences:{
          preload:resolve(__dirname,'./preload/test.load.built.js')
      }
    });
  
    // and load the index.html of the app.
    if(process.env.WEBPACK_DEV_SERVER_URL){
        aboutWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'about_window.html');
    }else{
        aboutWindow.loadURL(resolve(__dirname,'./renderer/about_window.html'));
    }
  
  
    // Open the DevTools.
    aboutWindow.webContents.openDevTools();
};


ipcMain.on('openAboutWin',()=>{
    createWindow()
})
  