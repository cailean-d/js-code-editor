import { observable, action, autorun } from 'mobx';
import { IOptions } from '@/interfaces/options';
import { IStore } from '@/interfaces/store';

export default class Options implements IOptions {
  @observable value = '';

  constructor(private store: IStore) {}

  @action merge(options: IOptions) {
    for (const key of Object.keys(options)) {
      this[key] = options[key];
    }
  }
}
