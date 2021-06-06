import { ipcRenderer } from 'electron'
console.log("hello main")

const boxDom = document.querySelector('.electron-version')

const btnHelp = document.createElement('button')
btnHelp.innerHTML = '打开help 窗口'

const btnAbout = document.createElement('button')
btnAbout.innerHTML = '打开about 窗口'

btnHelp.onclick = function(){
    ipcRenderer.send('openHelpWin')
}

btnAbout.onclick = function(){
    ipcRenderer.send('openAboutWin')
}

boxDom?.appendChild(btnAbout)
boxDom?.appendChild(btnHelp)