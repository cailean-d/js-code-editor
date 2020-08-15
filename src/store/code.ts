import { observable, computed, autorun } from 'mobx';
import { IStore } from '@/interfaces/store';
import { IPosition } from '@/interfaces/measure';

export default class Code {
  @observable codeLines: string[];

  constructor(private store: IStore) {
    autorun(() => {
      this.codeLines = this.store.options.value.split('\n');
    });
  }

  @computed get text(): string {
    return this.codeLines.join('\n');
  }

  @computed get start(): IPosition {
    return { row: 0, column: 0 };
  }

  @computed get end(): IPosition {
    return {
      row: this.codeLines.length - 1,
      column: this.codeLines[this.codeLines.length - 1].length
    }
  }

  @computed get length(): number {
    return this.codeLines.join('').length;
  }
}
