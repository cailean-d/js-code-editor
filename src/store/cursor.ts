import { observable, action } from 'mobx';
import { ICursor } from '@/interfaces/cursor';

export default class Cursor {
  @observable items: ICursor[] = [];

  constructor() {
    this.items.push({ row: 0, column: 0 });
  }

  @action addCursor() {
    this.items.push({ row: Math.random(), column: Math.random() })
  }
}
