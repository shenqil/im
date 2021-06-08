console.log("hello main")

const btnHelp = document.createElement('button')
btnHelp.innerHTML = '打开help 窗口'

const btnAbout = document.createElement('button')
btnAbout.innerHTML = '打开about 窗口'

const {openHlepWin,openAboutWin} = (window as any)

btnHelp.onclick = ()=>openHlepWin()

btnAbout.onclick = ()=>openAboutWin()

document.body.appendChild(btnAbout)
document.body.appendChild(btnHelp)