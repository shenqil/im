import {multiply} from '../public_moudule/a'

const input = document.createElement('input')
document.body.appendChild(input)

console.log("hello about")

input.addEventListener('input',(e)=>{
    const num = Number(input.value)
    console.log(multiply(num,num))
})