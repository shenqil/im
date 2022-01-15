import React from 'react';
import styles from './index.scss';

export interface IBaseInputProps{

}
/**
 * 输入框
 * */
const BaseInput = function (props:IBaseInputProps) {
  console.log(props);
  return (
    <div className={styles['base-input']}>
      <div className={`${styles['base-input__inner']} scroll`} contentEditable="true" />
    </div>
  );
};

export default BaseInput;
