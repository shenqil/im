import React, { FC } from 'react';
import styles from './index.scss';
import BaseInput from './components/BaseInput';
import Tools from './components/Tools';

const ChartInput:FC = function () {
  return (
    <div className={styles['chart-input']}>
      {/* 顶部工具栏 */}
      <div className={styles['chart-input__tools']}>
        <Tools />
      </div>

      {/* 输入框内容区 */}
      <div className={styles['chart-input__base']}>
        <BaseInput />
      </div>

      {/* 底部发送 */}
      <div className={styles['chart-input__bottom']}>
        <div className={styles['chart-input__bottom-btn']}>
          发送
        </div>
      </div>
    </div>
  );
};

export default ChartInput;
