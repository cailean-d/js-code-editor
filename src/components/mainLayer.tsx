import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import BackgroundLayer from './backgroundLayer';
import ForegroundLayer from './foregroundLayer';
import MeasureLayer from './measureLayer';
import TextLayer from './textLayer';
import CursorLayer from './cursorLayer';
import SelectionLayer from './selectionLayer';
import InputLayer from './inputLayer';
import useStore from '@/hooks/useStore';
import s from './mainLayer.module.css';

function MainLayer() {
  const layerElem = useRef<HTMLDivElement>();
  const { measure } = useStore();

  const handler = (e: React.UIEvent) => {
    measure.scrollTop = (e.target as HTMLDivElement).scrollTop;
  }

  useEffect(() => { layerElem.current.scrollTop = measure.scrollTop }, [measure.scrollTop]);

  return (
    <div ref={layerElem} className={s.mainLayer} onScroll={handler}>
      <BackgroundLayer>
        <MeasureLayer/>
        <InputLayer/>
      </BackgroundLayer>
      <TextLayer/>
      <ForegroundLayer>
        <SelectionLayer/>
        <CursorLayer/>
      </ForegroundLayer>
    </div>
  )
}

export default observer(MainLayer);
