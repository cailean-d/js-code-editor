import { observable, action } from 'mobx';
import { ICursor } from '@/interfaces/cursor';
import { IStore } from '@/interfaces/store';

export default class Cursor {
  @observable items: ICursor[] = [];

  constructor(private store: IStore) {
    this.items.push({ row: 0, column: 0 });
  }

  @action addCursor() {
    this.items.push({ row: Math.random(), column: Math.random() })
  }
}
