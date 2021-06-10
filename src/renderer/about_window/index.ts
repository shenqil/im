import {multiply} from '../public/a'
import moment from 'moment'
const input = document.createElement('input')
document.body.appendChild(input)

console.log("hello about")

input.addEventListener('input',(e)=>{
    const num = Number(input.value)
    console.log(multiply(num,num))
    console.log(moment().format('MMMM Do YYYY, h:mm:ss a'))
})