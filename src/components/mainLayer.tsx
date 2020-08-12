import React from 'react';
import MeasureLayer from './measureLayer';
import TextLayer from './textLayer';
import BackgroundLayer from './backgroundLayer';
import ForegroundLayer from './foregroundLayer';
import s from './mainLayer.module.css';

function MainLayer() {
  return (
    <div className={s.mainLayer}>
      <BackgroundLayer>
        <MeasureLayer/>
      </BackgroundLayer>
      <TextLayer/>
      <ForegroundLayer>

      </ForegroundLayer>
    </div>
  )
}

export default MainLayer;
