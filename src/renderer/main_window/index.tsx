import img1 from '@renderer/public/img/2abbbce9b334558100246ffe07fd9c6f11.jpg'
import img2 from '../public/img/1221312.jpg'

import  './index.scss'
import '../public/css/reset.css'
import '../public/font/iconfont.css'

import React, { useState } from "react";
import { render } from "react-dom";

function App() {
    const [state, setState] = useState("CLICK ME");
  
    return <div>
      <div className="box">
        <div className="content">
          德玛西亚，永不退缩
          <i className="iconfont icon-xiazai"></i>
          <img src={img1} />
          <img src={img2} />
        </div>
      </div>
      <button onClick={() => setState("CLICKED")}>{state}</button>
    </div>;
  }
  
  render(<App />, document.getElementById("root"));