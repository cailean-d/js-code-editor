import { observable, computed } from 'mobx';
import { IDimension } from '@/interfaces/measure';
import { IStore } from '@/interfaces/store';

export default class Measure {
  @observable text = 'X';
  @observable measureElement: HTMLElement;
  @observable measureScrollElement: HTMLElement;
  @observable textLayer: HTMLElement;
  @observable inputElement: HTMLElement;
  @observable editorElement: HTMLElement;
  @observable scrollTop: number;

  constructor(private store: IStore) {}

  @computed get symbolSize(): IDimension {
    if (!this.measureElement) return { width: 0, height: 0 };
    return {
      width: parseFloat(getComputedStyle(this.measureElement).width),
      height: parseFloat(getComputedStyle(this.measureElement).height)
    };
  }

  @computed get layerHeight(): number {
    return this.symbolSize.height * this.store.code.codeLines.length;
  }

  @computed get scrollWidth(): number {
    if (!this.measureScrollElement) return 0;
    return this.measureScrollElement.offsetWidth - this.measureScrollElement.clientWidth;
  }

}
