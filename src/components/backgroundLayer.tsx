import React from 'react';
import s from './editor.module.css';

function BackgroundLayer({ children }) {
  return (
    <div className={s.layer}>
      {children}
    </div>
  )
}

export default BackgroundLayer;
