import React from 'react';
import { observer } from 'mobx-react-lite';
import useStore from './../hooks/useStore';

function Editor() {
  const { cursor } = useStore();
  return (
    <div style={{padding: '20px'}}>
      <button onClick={() => cursor.addCursor()} >click me</button>
      {cursor.items.map(it => (
        <li>{it.row} {it.column}</li>
      ))}
    </div>
  )
}

export default observer(Editor);
