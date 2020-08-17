import React, { useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import useStore from '@/hooks/useStore';
import s from './editor.module.css';

function Editor({ children }) {
  const elem = useRef<HTMLDivElement>();
  const { reference } = useStore();

  useEffect(() => { reference.editorElement = elem.current }, [elem.current]);
  useEffect(() => { reference.inputElement?.focus() }, [reference.inputElement]);

  const focus = () => reference.inputElement?.focus();

  return (
    <div ref={elem} onFocus={focus} className={s.editor} tabIndex={0}>
      {children}
    </div>
  )
}

export default observer(Editor);
