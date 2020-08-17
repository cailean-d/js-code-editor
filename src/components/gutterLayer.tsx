import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import s from './gutterLayer.module.css';
import useStore from '@/hooks/useStore';

function GutterLayer() {
  const layerElem = useRef<HTMLDivElement>();
  const { gutter, measure } = useStore();

  const lineStyle = {
    height: measure.symbolSize.height + 'px',
    width: gutter.width + 'px',
  }

  const layerStyle = {
    marginRight: '-' + measure.scrollWidth + 'px',
  }

  const handler = (e: React.UIEvent) => {
    measure.scrollTop = (e.target as HTMLDivElement).scrollTop;
  }

  useEffect(() => { layerElem.current.scrollTop = measure.scrollTop }, [measure.scrollTop]);

  return (
    <div ref={layerElem} className={s.gutterLayer} onScroll={handler} style={layerStyle}>
      {gutter.lines.map((_, i) => (
        <div className={s.lineNumber} style={lineStyle}>{i + 1}</div>
      ))}
    </div>
  )
}

export default observer(GutterLayer);
