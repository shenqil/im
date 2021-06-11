import {multiply} from '../public/js/a'
import { add} from '../public/js/b'

import '../public/font/iconfont.css'

const input = document.createElement('input')
document.body.appendChild(input)

input.addEventListener('input',(e)=>{
    const num = Number(input.value)
    console.log(multiply(num,num))
    console.log(add(num,num))

    console.error(new Error('错误'))
})

console.log("hello help")


const i = document.createElement('i')
i.className = 'iconfont icon-xiazai'
document.body.appendChild(i)

