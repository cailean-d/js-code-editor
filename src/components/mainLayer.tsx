import React from 'react';
import MeasureLayer from './measureLayer';
import TextLayer from './textLayer';
import s from './mainLayer.module.css';

function MainLayer() {
  return (
    <div className={s.mainLayer}>
      <MeasureLayer/>
      <TextLayer/>
    </div>
  )
}

export default MainLayer;
