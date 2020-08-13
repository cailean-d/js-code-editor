import React from 'react';
import { observer } from 'mobx-react-lite';
import s from './cursorLayer.module.css';
import useStore from '@/hooks/useStore';
import useResetAnimation from '@/hooks/useResetAnimation';

function CursorLayer() {
  const { cursor, measure } = useStore();
  const animation = useResetAnimation([cursor.items.length]);

  return (
    <div className={s.cursorLayer}>
      {cursor.items.map(item => (
        <div className={s.cursor} style={{
          top: item.row * measure.symbolSize.height + 'px',
          left: item.column * measure.symbolSize.width + 'px',
          animation: animation
         }}>
        </div>
      ))}
    </div>
  )
}

export default observer(CursorLayer);
