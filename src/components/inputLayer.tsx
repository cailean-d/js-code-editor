import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import useStore from '@/hooks/useStore';
import s from './inputLayer.module.css';

function InputLayer() {
  const inputElem = useRef<HTMLTextAreaElement>();
  const { measure, cursor, reference, keymap, code, selection } = useStore();

  useEffect(() => {
    keymap.onText(text => code.inputText(text));
    keymap.addCommand('ArrowLeft', () => cursor.decreaseAllColumns());
    keymap.addCommand('ArrowRight', () => cursor.increaseAllColumns());
    keymap.addCommand('ArrowUp', () => cursor.decreaseAllRows());
    keymap.addCommand('ArrowDown', () => cursor.increaseAllRows());
    keymap.addCommand('Backspace', () => code.removeText());
    keymap.addCommand('Space', () => code.inputText(' '));
    keymap.addCommand('Tab', () => code.indentIn());
    keymap.addCommand('Shift+Tab', () => code.indentOut());
    keymap.addCommand('Enter', () => code.newline());
    keymap.addCommand('Ctrl+A', () => selection.selectAll());
  }, []);

  useEffect(() => { reference.inputElement = inputElem.current }, [inputElem.current]);

  const focus = () => reference.editorElement.classList.add('editor-focused');
  const blur = () => reference.editorElement.classList.remove('editor-focused');
  const keydown = (e: React.KeyboardEvent) => keymap.processInput(e);

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
        onKeyDown={keydown}
        style={style}
      ></textarea>
    </div>
  )
}

export default observer(InputLayer);
