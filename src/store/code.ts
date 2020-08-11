import { observable, computed, autorun } from 'mobx';
import { IStore } from '@/interfaces/store';

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
}
