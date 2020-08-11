import React from 'react';
import s from './editor.module.css';

function Editor({ children }) {
  return (
    <div className={s.editor} tabIndex={0}>
      {children}
    </div>
  )
}

export default Editor;
