import { observable, autorun, computed } from 'mobx';
import { IStore } from '@/interfaces/store';

export default class Gutter {
  @observable lines: any[];

  constructor(private store: IStore) {
    autorun(() => {
      this.lines = Array(this.store.code.codeLines.length).fill({});
    });
  }

  @computed get width() {
    const minDigits = 3;
    const currDigits = (this.lines.length + "").length;
    const paddings = 20;
    const count = Math.max(currDigits, minDigits);
    const width = this.store.measure.symbolSize.width * count + paddings;
    return width;
  }
}
