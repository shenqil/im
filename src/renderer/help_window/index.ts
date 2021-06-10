import {multiply} from '../public/a'
import { add} from '../public/b'

const input = document.createElement('input')
document.body.appendChild(input)

input.addEventListener('input',(e)=>{
    const num = Number(input.value)
    console.log(multiply(num,num))
    console.log(add(num,num))
})

console.log("hello help")