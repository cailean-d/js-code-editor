import { observable, computed, autorun, action } from 'mobx';
import { IStore } from '@/interfaces/store';
import { IPosition } from '@/interfaces/measure';
import { range } from '@/utils/range';

export default class Code {
  @observable codeLines: string[];

  constructor(private store: IStore) {
    autorun(() => { this.text = this.store.options.value });
  }

  set text(value: string) {
    this.setText(value);
  }

  @computed get text(): string {
    return this.codeLines.join('\n');
  }

  @action setText(value: string) {
    this.codeLines = value.split('\n');
    this.store.cursor?.removeAll();
    this.store.cursor?.addCursor(0, 0);
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

  @action insertText(text: string) {
    if (this.store.selection.hasSelection) {
      // TODO: clear selections
    }
    for (const cursor of this.store.cursor.items) {
      const line = this.codeLines[cursor.row];
      const { newLine } = this.splitLine(line, cursor.column, cursor.column, text);
      this.codeLines[cursor.row] = newLine;
      for (const _ of range(0, text.length)) {
        this.store.cursor.increaseCursorColumn(cursor);
      }
      this.store.cursor.rebaseCursors(cursor, 0, text.length);
    }
  }

  @action newline() {
    if (this.store.selection.hasSelection) {
      // TODO: clear selections
    }
    for (const cursor of this.store.cursor.items) {
      const line = this.codeLines[cursor.row];
      const { newLine, substr2 } = this.splitLine(line, cursor.column, cursor.column, '');
      this.codeLines[cursor.row] = newLine;
      this.codeLines.splice(cursor.row + 1, 0, substr2);
      this.store.cursor.increaseCursorRow(cursor);
      this.store.cursor.resetCursorColumn(cursor);
      this.store.cursor.rebaseCursors(cursor, 1, 0);
    }
  }

  @action removeText() {
    if (this.store.selection.hasSelection) {
      // TODO: clear selections
      // return
    }
    for (const cursor of this.store.cursor.items) {
      const isStartOfLine = cursor.column === 0;
      const isNotFirstLine = cursor.row > 0;
      const isNotFirstColumn = cursor.column > 0;

      if (isStartOfLine && isNotFirstLine) {
        const line = this.codeLines[cursor.row];
        const prevLine = this.codeLines[cursor.row - 1];
        this.codeLines[cursor.row - 1] += line;
        this.codeLines.splice(cursor.row, 1);
        this.store.cursor.decreaseCursorRow(cursor);
        this.store.cursor.setCursorColumn(cursor, prevLine.length)
        this.store.cursor.rebaseCursors(cursor, -1, 0);
      } else if (isNotFirstColumn) {
        const line = this.codeLines[cursor.row];
        const { newLine } = this.splitLine(line, cursor.column - 1, cursor.column, '');
        this.codeLines[cursor.row] = newLine;
        this.store.cursor.decreaseCursorColumn(cursor);
        this.store.cursor.rebaseCursors(cursor, 0, -1);
      }
    }
  }

  @action indentIn() {}
  @action indentOut() {}

  private splitLine(line: string, pos1: number, pos2: number, text: string) {
    const s1 = line.substring(0, pos1);
    const s2 = line.substring(pos2);
    return {
      newLine: s1 + text + s2,
      substr1: s1,
      substr2: s2,
    }
  }
}
