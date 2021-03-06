import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import s from './textLayer.module.css';
import s2 from './editor.module.css';
import useStore from '@/hooks/useStore';

function TextLayer() {
  const layerElem = useRef<HTMLDivElement>();
  const { measure, code, cursor, selection, reference } = useStore();

  const captureStart = (e: MouseEvent) => {
    if (e.which !== 1 || !layerElem.current.contains(e.target as Node)) return;
    if (!e.ctrlKey) {
      cursor.removeAll();
      selection.removeAll();
    }
    cursor.startCapture(e);
    selection.startCapture(e);
  }

  const captureUpdate = (e: MouseEvent) => {
    e.preventDefault();
    if (e.which !== 1 || !layerElem.current.contains(e.target as Node)) return;
    cursor.updateCapture(e);
    selection.updateCapture(e);
  }

  const captureStop = (e: MouseEvent) => {
    cursor.stopCapture(e);
    selection.stopCapture(e);
  }

  useEffect(() => {
    document.addEventListener('mousedown', captureStart);
    document.addEventListener('mousemove', captureUpdate);
    document.addEventListener('mouseup', captureStop);
    return () => {
      document.removeEventListener('mousedown', captureStart);
      document.removeEventListener('mousemove', captureUpdate);
      document.removeEventListener('mouseup', captureStop);
    }
  }, []);

  useEffect(() => { reference.textLayer = layerElem.current }, [layerElem.current])

  return (
    <div ref={layerElem} className={s2.layer} style={{ height: measure.layerHeight + 'px' }}>
      {measure.symbolSize.height > 0 && code.codeLines.map(item => (
        <div className={s.line} style={{ height: measure.symbolSize.height + 'px' }}>
          <span>{item}</span>
        </div>
      ))}
    </div>
  )
}

export default observer(TextLayer);
