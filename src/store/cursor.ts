import { observable, action, computed } from 'mobx';
import { range } from '@/utils/range';
import { ICursor } from '@/interfaces/cursor';
import { IStore } from '@/interfaces/store';
import { ISelection } from '@/interfaces/selection';

export default class Cursor {
  @observable items: ICursor[] = [];
  @observable captured: ICursor;

  constructor(private store: IStore) {
    this.addCursor(0, 0);
  }

  isCursorExist(row: number, column: number) {
    return this.items.some(item => item.row === row && item.column === column);
  }

  getCursor(row: number, column: number) {
    return this.items.find(item => item.row === row && item.column === column);
  }

  @computed get upperCursor() {
    const predicate = (prev: ICursor, curr: ICursor) => curr.row < prev.row ? curr : prev;
    return this.items.length && this.items.reduce(predicate, this.items[0]);
  }

  @action addCursor(_row: number, _column: number) {
    const { row, column } = this.getActualCursorPosition(_row, _column);
    const isExist = this.isCursorExist(row, column);
    if (!isExist) {
      this.items.push({ row, column });
    }
    return this.getCursor(row, column);
  }

  @action setCursor(cursor: ICursor, _row: number, _column: number) {
    const { row, column } = this.getActualCursorPosition(_row, _column);
    cursor.row = row;
    cursor.column = column;
  }

  @action setCursorRow(cursor: ICursor, row: number) {
    cursor.row = row;
  }

  @action setCursorColumn(cursor: ICursor, column: number) {
    cursor.column = column;
  }

  @action resetCursorColumn(cursor: ICursor) {
    cursor.column = 0;
  }

  @action resetCursorRow(cursor: ICursor) {
    cursor.row = 0;
  }

  @action removeCursor(row: number, column: number) {
    this.items = this.items.filter(item => item.row !== row || item.column !== column);
  }

  @action removeCursorRef(cursor: ICursor) {
    this.items = this.items.filter(item => item !== cursor);
  }

  @action removeExtraCursors() {
    this.items = this.items.slice(0, 1);
  }

  @action removeAll() {
    this.items = [];
  }

  @action increaseAllRows() {
    for (const cursor of this.items) this.increaseCursorRow(cursor);
  }

  @action increaseAllColumns() {
    for (const cursor of this.items) this.increaseCursorColumn(cursor);
  }

  @action decreaseAllRows() {
    for (const cursor of this.items) this.decreaseCursorRow(cursor);
  }

  @action decreaseAllColumns() {
    for (const cursor of this.items) this.decreaseCursorColumn(cursor);
  }

  @action increaseCursorRow(cursor: ICursor) {
    const maxRows = this.store.code.codeLines.length - 1;
    if (cursor.row < maxRows) {
      cursor.row++;
      cursor.column = Math.min(cursor.column, this.store.code.codeLines[cursor.row].length);
    }
  }

  @action decreaseCursorRow(cursor: ICursor) {
    if (cursor.row > 0) {
      cursor.row--;
      cursor.column = Math.min(cursor.column, this.store.code.codeLines[cursor.row].length);
    }
  }

  @action increaseCursorColumn(cursor: ICursor) {
    const maxCols = this.store.code.codeLines[cursor.row].length;
    const maxRow = this.store.code.codeLines.length - 1;
    if (cursor.column === maxCols && cursor.row !== maxRow) {
      this.increaseCursorRow(cursor);
      cursor.column = 0;
    } else if (cursor.column < maxCols) {
      cursor.column++;
    }
  }

  @action decreaseCursorColumn(cursor: ICursor) {
    if (cursor.column === 0 && cursor.row > 0) {
      this.decreaseCursorRow(cursor);
      cursor.column = this.store.code.codeLines[cursor.row].length;
    } else if (cursor.column > 0) {
      cursor.column--;
    }
  }

  @action startCapture(e: MouseEvent) {
    const { row, column } = this.getCursorPositionByCoords(e);
    const cursor = this.getCursor(row, column);
    if (cursor) {
      this.captured = cursor;
    } else {
      this.captured = this.addCursor(row, column);
    }
  }

  @action updateCapture(e: MouseEvent) {
    if (!this.captured) return;
    const { row, column } = this.getCursorPositionByCoords(e);
    this.setCursor(this.captured, row, column);
  }

  @action stopCapture(_: MouseEvent) {
    this.captured = null;
  }

  @action rebaseCursors(_cursor: ICursor, row: number, column: number) {
    const index = this.items.indexOf(_cursor);
    for (const cursor of this.items.slice(index + 1)) {
      if (cursor.row === _cursor.row) {
        for (const _ of range(0, Math.abs(column))) {
          if (column > 0)
            this.increaseCursorColumn(cursor);
          else
            this.decreaseCursorColumn(cursor);
        }
      }
      for (const _ of range(0, Math.abs(row))) {
        if (row > 0)
          this.increaseCursorRow(cursor);
        else
          this.decreaseCursorRow(cursor);
      }
    }
  }

  getActualCursorPosition(row: number, column: number) {
    const codeLines = this.store.code.codeLines;
    const len = codeLines.length;
    const maxRows = this.store.code.codeLines.length - 1;
    const maxCols = row < len ? codeLines[row].length : codeLines[maxRows].length;
    return {
      row: row > 0 ? Math.min(maxRows, row) : 0,
      column: column > 0 ? Math.min(maxCols, column) : 0,
    };
  }

  getCursorPositionByCoords(e: MouseEvent) {
    const textLayerBox = this.store.reference.textLayer.getBoundingClientRect();
    const x = e.pageX - textLayerBox.left;
    const y = e.pageY - textLayerBox.top;
    const row = this.normalizeRowPosition(y / this.store.measure.symbolSize.height);
    const column = this.normalizeColumnPosition(x / this.store.measure.symbolSize.width);
    return this.getActualCursorPosition(row, column);
  }

  @action moveCursorUp(cursor: ICursor, offset = 1) {
    cursor.row -= offset;
  }

  @action moveCursorLeft(cursor: ICursor, offset = 1) {
    cursor.column -= offset;
  }

  isCursorIntersectsSelection(cursor: ICursor, selection: ISelection) {
    const [start, end] = this.store.selection.normalizePosition(selection.start, selection.end);

    if (cursor.row > start.row && cursor.row < end.row) {
      return true;
    }

    const first = selection.lines[0];
    const last = selection.lines[selection.lines.length - 1];

    if (
      cursor.row === start.row &&
      cursor.column >= first.columnStart &&
      cursor.column <= first.columnEnd
    ) {
      return true;
    }

    if (
      cursor.row === end.row &&
      cursor.column >= last.columnStart &&
      cursor.column <= last.columnEnd
    ) {
      return true;
    }

    return false;
  }

  private normalizeRowPosition(row: number) {
    const floatPart = +(row % 1).toFixed(1) * 10;
    if (floatPart > 7) {
      return Math.ceil(row);
    } else {
      return Math.floor(row);
    }
  }

  private normalizeColumnPosition(column: number) {
    return Math.round(column);
  }
}
