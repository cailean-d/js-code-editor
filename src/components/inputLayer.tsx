import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import useStore from '@/hooks/useStore';
import s from './inputLayer.module.css';

function InputLayer() {
  const inputElem = useRef<HTMLTextAreaElement>();
  const { measure, cursor } = useStore();

  useEffect(() => { measure.inputElement = inputElem.current }, [inputElem.current]);

  const focus = () => measure.editorElement.classList.add('editor-focused');
  const blur = () => measure.editorElement.classList.remove('editor-focused');

  const style: React.CSSProperties = {
    top: cursor.upperCursor.row * measure.symbolSize.height + 'px',
    left: cursor.upperCursor.column * measure.symbolSize.width + 'px',
  }

  return (
    <div>
      <textarea
        ref={inputElem}
        className={s.textInput}
        autoCorrect="off"
        autoComplete="off"
        spellCheck="false"
        tabIndex={-1}
        onFocus={focus}
        onBlur={blur}
        style={style}
      ></textarea>
    </div>
  )
}

export default observer(InputLayer);