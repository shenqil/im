import React from 'react'
import { render } from 'react-dom'
import styles from './index.scss';
function App() {
  return (
    <div className={styles.login}>
      登录
    </div>
  )
}

render(<App />, document.getElementById('root'))
