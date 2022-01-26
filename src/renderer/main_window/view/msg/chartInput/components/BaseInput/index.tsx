import React, { forwardRef, LegacyRef } from 'react';
import styles from './index.modules.scss';

export interface IBaseInputProps{
}
/**
 * 输入框
 * */
const BaseInput = forwardRef((props:IBaseInputProps, editPanelRef:LegacyRef<HTMLDivElement>) => (
  <div className={styles['base-input']}>
    <div
      contentEditable="true"
      ref={editPanelRef}
      className={`${styles['base-input__inner']} scroll`}
    />
  </div>
));

export default BaseInput;
