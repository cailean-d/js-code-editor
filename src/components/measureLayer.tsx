import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import s from './textLayer.module.css';
import s2 from './measureLayer.module.css';
import useStore from '@/hooks/useStore';

function MeasureLayer() {
  const lineElem = useRef<HTMLDivElement>();
  const { measure } = useStore();

  useEffect(() => {
    measure.lineElement = lineElem.current;
  }, [lineElem.current])

  return (
    <div className={s2.measureLayer}>
      <div ref={lineElem} className={s.line + ' ' + s2.measureLine}>{measure.text}</div>
    </div>
  )
}

export default observer(MeasureLayer);
