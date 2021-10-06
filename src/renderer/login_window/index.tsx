import React from 'react'
import { render } from 'react-dom'
import NormalLogin from './components/NormalLogin';
import 'antd/dist/antd.css'
import style from './index.scss';
function App() {
  return (
    <div className={style.login}>
      <div className={style.model}>
        <NormalLogin/>
      </div>
    </div>
  )
}

render(<App />, document.getElementById('root'))
