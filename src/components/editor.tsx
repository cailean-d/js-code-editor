import React, { useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import useStore from '@/hooks/useStore';
import s from './editor.module.css';

function Editor({ children }) {
  const elem = useRef<HTMLDivElement>();
  const { measure } = useStore();

  useEffect(() => { measure.editorElement = elem.current }, [elem.current]);
  useEffect(() => { measure.inputElement?.focus() }, [measure.inputElement]);

  const focus = () => measure.inputElement?.focus();

  return (
    <div ref={elem} onFocus={focus} className={s.editor} tabIndex={0}>
      {children}
    </div>
  )
}

export default observer(Editor);
