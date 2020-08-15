import React from 'react';
import { observer } from 'mobx-react-lite';
import s from './selectionLayer.module.css';
import useStore from '@/hooks/useStore';
import { ISelectionLine } from '@/interfaces/selection';

function SelectionLayer() {
  const { measure, selection } = useStore();

  const lineStyle = (line: ISelectionLine): React.CSSProperties => {
    return {
      top: line.row * measure.symbolSize.height +  'px',
      left: line.columnStart * measure.symbolSize.width +  'px',
      height: measure.symbolSize.height + 'px',
      width: (line.columnEnd - line.columnStart) * measure.symbolSize.width + 'px',
    }
  }

  return (
    <div className={s.selectionLayer}>
      {selection.items.map(item => (
        <div>
          {item.lines.map(line => (
            <div className={s.selectedText} style={lineStyle(line)}></div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default observer(SelectionLayer);
