import React from 'react';
import { observer } from 'mobx-react-lite';
import s from './selectionLayer.module.css';
import useStore from '@/hooks/useStore';
import { ISelectionLine } from '@/interfaces/selection';

function SelectionLayer() {
  const { measure, selection } = useStore();

  const lineStyle = (line: ISelectionLine): React.CSSProperties => {
    const space = line.extraSpace ? 1 : 0;
    return {
      top: line.row * measure.symbolSize.height +  'px',
      left: line.columnStart * measure.symbolSize.width +  'px',
      height: measure.symbolSize.height + 'px',
      width: (line.columnEnd - line.columnStart + space) * measure.symbolSize.width + 'px',
    }
  }

  const lineClass = (line: ISelectionLine): string => {
    return [
      s.selectedText,
      line.corners?.leftTop ? s.cornerLeftTop : null,
      line.corners?.leftBottom ? s.cornerLeftBottom : null,
      line.corners?.rightTop ? s.cornerRightTop : null,
      line.corners?.rightBottom ? s.cornerRightBottom : null,
    ].filter(Boolean).join(' ');
  }

  const negativeCorner = (className: string, svgPath: string) => {
    return (
      <div className={s.cornerNegative + ' ' + className}>
        <svg
          viewBox="0 0 1 1"
          xmlns="http://www.w3.org/2000/svg"
          className={s.cornerSvg}
          >
          <path d={svgPath}/>
        </svg>
      </div>
    );
  }

  return (
    <div className={s.selectionLayer}>
      {selection.items.map(item => (
        <div>
          {item.lines.map(line => (
            <div className={lineClass(line)} style={lineStyle(line)}>
              {line.corners?.negative && (
                <>
                  {line.corners?.negative?.leftBottom &&
                    negativeCorner(s.leftBottom, "M 1,0 L 1,1 L 0,1 Q .85 .85, 1 0")
                  }
                  {line.corners?.negative?.rightBottom &&
                    negativeCorner(s.rightBottom, "M 0,0 L 0,1 L 1,1 Q .15 .85, 0 0")
                  }
                  {line.corners?.negative?.rightTop &&
                    negativeCorner(s.rightTop, "M 0,1 L 0,0 L 1,0 Q .15 .15, 0 1")
                  }
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default observer(SelectionLayer);
