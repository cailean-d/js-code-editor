import { observable, computed } from 'mobx';
import { IDimension } from '@/interfaces/measure';
import { IStore } from '@/interfaces/store';

export default class Measure {
  @observable text = 'X';
  @observable scrollTop: number;

  constructor(private store: IStore) {}

  @computed get symbolSize(): IDimension {
    const { measureElement } = this.store.reference;
    if (!measureElement) return { width: 0, height: 0 };
    return {
      width: parseFloat(getComputedStyle(measureElement).width),
      height: parseFloat(getComputedStyle(measureElement).height)
    };
  }

  @computed get layerHeight(): number {
    return this.symbolSize.height * this.store.code.codeLines.length;
  }

  @computed get scrollWidth(): number {
    const { measureScrollElement } = this.store.reference;
    if (!measureScrollElement) return 0;
    return measureScrollElement.offsetWidth - measureScrollElement.clientWidth;
  }

}
