import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import s from './textLayer.module.css';
import s2 from './measureLayer.module.css';
import useStore from '@/hooks/useStore';

function MeasureLayer() {
  const lineElem = useRef<HTMLDivElement>();
  const scrollElem = useRef<HTMLDivElement>();
  const { measure } = useStore();

  useEffect(() => {
    measure.measureElement = lineElem.current;
  }, [lineElem.current])

  useEffect(() => {
    measure.measureScrollElement = scrollElem.current;
  }, [scrollElem.current])

  return (
    <div className={s2.measureLayer}>
      <div ref={lineElem} className={s.line + ' ' + s2.measureLine}>{measure.text}</div>
      <div ref={scrollElem} className={s2.measureScrollWidth}></div>
    </div>
  )
}

export default observer(MeasureLayer);
