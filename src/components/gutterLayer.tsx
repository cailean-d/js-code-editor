import React from 'react';
import { observer } from 'mobx-react-lite';
import s from './gutterLayer.module.css';
import useStore from '@/hooks/useStore';

function GutterLayer() {
  const { gutter, measure } = useStore();
  const style = {
    height: measure.symbolSize.height + 'px',
    width: gutter.width + 'px'
  }
  return (
    <div className={s.gutterLayer}>
      {gutter.lines.map((_, i) => (
        <div className={s.lineNumber} style={style}>{i + 1}</div>
      ))}
    </div>
  )
}

export default observer(GutterLayer);
