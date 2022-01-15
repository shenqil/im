import React, { FC } from 'react';
import styles from './index.scss';
import Emoji from './components/Emoji';

const Tools:FC = function () {
  return (
    <div className={styles.tools}>
      <Emoji />
    </div>
  );
};

export default Tools;
