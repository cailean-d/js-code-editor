import React, { useRef } from 'react';
import s from './editor.module.css';

function Editor({ children }) {
  const elem = useRef<HTMLDivElement>();

  function focus() {
    elem.current.classList.add('editor-focused');
  }

  function blur() {
    elem.current.classList.remove('editor-focused');
  }

  return (
    <div ref={elem} onFocus={focus} onBlur={blur} className={s.editor} tabIndex={0}>
      {children}
    </div>
  )
}

export default Editor;
