import React from 'react';
import { observer } from 'mobx-react-lite';
import s from './cursorLayer.module.css';
import useStore from '@/hooks/useStore';
import useResetAnimation from '@/hooks/useResetAnimation';
import { ICursor } from '@/interfaces/cursor';

function CursorLayer() {
  const { cursor, measure } = useStore();
  const animation = useResetAnimation([cursor.items.length]);

  const style = (cursor: ICursor): React.CSSProperties => {
    return {
      top: cursor.row * measure.symbolSize.height + 'px',
      left: cursor.column * measure.symbolSize.width + 'px',
      animation: animation
    }
  }

  return (
    <div className={s.cursorLayer}>
      {cursor.items.map(item => (
        <div className={s.cursor} style={style(item)}>
        </div>
      ))}
    </div>
  )
}

export default observer(CursorLayer);
