import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import s from './cursorLayer.module.css';
import useStore from '@/hooks/useStore';

function CursorLayer() {
  const [ animation, setAnimation ] = useState('');
  const { cursor, measure } = useStore();

  useEffect(() => {
    setAnimation('none');
    const r = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimation('');
      })
    })
    return () => {
      cancelAnimationFrame(r);
    }
  }, [cursor.items.length])

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
