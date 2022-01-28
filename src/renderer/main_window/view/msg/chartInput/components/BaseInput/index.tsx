import React, {
  forwardRef, LegacyRef, KeyboardEvent, useRef,
} from 'react';
import styles from './index.modules.scss';

export interface IBaseInputProps{
  sendMsg:Function
}
/**
 * 输入框
 * */
const BaseInput = forwardRef((
  { sendMsg }:IBaseInputProps,
  editPanelRef:LegacyRef<HTMLDivElement>,
) => {
  function keyUp(e:KeyboardEvent<HTMLDivElement>) {
    if (
      e.code === 'Enter' && !e.shiftKey
    ) {
      sendMsg();
    }
  }

  function keyDown(e:KeyboardEvent<HTMLDivElement>) {
    if (
      e.code === 'Enter' && !e.shiftKey
    ) {
      e.preventDefault();
    }
  }
  return (
    <div className={styles['base-input']}>
      <div
        contentEditable="true"
        ref={editPanelRef}
        className={`${styles['base-input__inner']} scroll`}
        onKeyUp={keyUp}
        onKeyDown={keyDown}
        role="textbox"
        tabIndex={0}
        aria-label="input"
      />
    </div>
  );
});

export default BaseInput;
