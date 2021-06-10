import {multiply} from '../public/a'
import { add} from '../public/b'
console.log("hello main")

import _ from 'lodash'
import moment from 'moment'

import '@renderer/static/js/index.js'
// import imgSrc from '@renderer/static/img/2abbbce9b334558100246ffe07fd9c6f11.jpg'

const btnHelp = document.createElement('button')
btnHelp.innerHTML = '打开help 窗口'

const btnAbout = document.createElement('button')
btnAbout.innerHTML = '打开about 窗口'

const input = document.createElement('input')

const {openHlepWin,openAboutWin} = (window as any)

btnHelp.onclick = ()=>openHlepWin()

btnAbout.onclick = ()=>openAboutWin()

document.body.appendChild(btnAbout)
document.body.appendChild(btnHelp)
document.body.appendChild(input)

input.addEventListener('input',(e)=>{
    const num = Number(input.value)
    console.log(multiply(num,num))
    console.log(add(num,num))
    console.log(_.add(num,num))
    console.log(moment().format('MMMM Do YYYY, h:mm:ss a'))
})

// const img = document.createElement('img')
// img.src = imgSrc

// document.body.appendChild(img)