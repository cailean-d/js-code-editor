import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import s from './textLayer.module.css';
import s2 from './editor.module.css';
import useStore from '@/hooks/useStore';

function TextLayer() {
  const layerElem = useRef<HTMLDivElement>();
  const { measure, code } = useStore();

  useEffect(() => {
    measure.textLayer = layerElem.current;
  }, [layerElem.current])

  return (
    <div ref={layerElem} className={s2.layer}>
      {measure.symbolSize.height > 0 && code.codeLines.map(item => (
        <div className={s.line} style={{ height: measure.symbolSize.height + 'px' }}>
          <span>{item}</span>
        </div>
      ))}
    </div>
  )
}

export default observer(TextLayer);
