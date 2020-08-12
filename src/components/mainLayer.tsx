import React from 'react';
import BackgroundLayer from './backgroundLayer';
import ForegroundLayer from './foregroundLayer';
import MeasureLayer from './measureLayer';
import TextLayer from './textLayer';
import CursorLayer from './cursorLayer';
import s from './mainLayer.module.css';

function MainLayer() {
  return (
    <div className={s.mainLayer}>
      <BackgroundLayer>
        <MeasureLayer/>
      </BackgroundLayer>
      <TextLayer/>
      <ForegroundLayer>
        <CursorLayer/>
      </ForegroundLayer>
    </div>
  )
}

export default MainLayer;
