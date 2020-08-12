import React from 'react';
import s from './editor.module.css';

function ForegroundLayer({ children }) {
  return (
    <div className={s.layer + ' ' + s.untouchable}>
      {children}
    </div>
  )
}

export default ForegroundLayer;
