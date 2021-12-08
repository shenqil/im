import React from 'react';
import { render } from 'react-dom';
import 'antd/dist/antd.css';
import '@renderer/public/css/index.scss';
import App from './view/App';

render(<App />, document.getElementById('root'));
