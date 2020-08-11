import { observable, computed } from 'mobx';
import { IDimension, ITextLayerOffset } from '@/interfaces/measure';
import { IStore } from '@/interfaces/store';

export default class Measure {
  @observable text = 'X';
  @observable lineElement: HTMLElement;
  @observable textLayer: HTMLElement;

  constructor(private store: IStore) {}

  @computed get symbolSize(): IDimension {
    if (!this.lineElement) return { width: 0, height: 0 };
    return {
      width: parseFloat(getComputedStyle(this.lineElement).width),
      height: parseFloat(getComputedStyle(this.lineElement).height)
    };
  }

  @computed get textLayerOffset(): ITextLayerOffset {
    if (!this.textLayer) return { top: 0, left: 0 };
    return {
      top: parseInt(getComputedStyle(this.textLayer).paddingTop),
      left: parseInt(getComputedStyle(this.textLayer).paddingLeft)
    }
  }

}
