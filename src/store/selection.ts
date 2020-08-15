import { observable, computed, action } from 'mobx';
import { IStore } from '@/interfaces/store';
import { ISelection } from '@/interfaces/selection';
import { IPosition } from '@/interfaces/measure';
import { ISelectionLine } from '@/interfaces/selection';

export default class Selection {
  @observable items: ISelection[] = [];
  @observable captured: ISelection;

  constructor(private store: IStore) {}

  @computed get hasSelection() {
    return !!this.items.length;
  }

  isSelectionExist(start: IPosition, end: IPosition) {
    return this.items.some(item => (
      item.start.row === start.row &&
      item.start.column === start.column &&
      item.end.row === end.row &&
      item.end.column === end.column
    ));
  }

  isSelectionEmpty(selection: ISelection) {
    return selection.length === 0;
  }

  getSelection(start: IPosition, end: IPosition) {
    return this.items.find(item => (
      item.start.row === start.row &&
      item.start.column === start.column &&
      item.end.row === end.row &&
      item.end.column === end.column
    ));
  }

  @action selectAll() {
    this.removeAll();
    this.addSelection(this.store.code.start, this.store.code.end);
  }

  @action addSelection(start: IPosition, end: IPosition) {
    this.items.push({ start, end, length: 0, lines: [] });
    const selection = this.getSelection(start, end);
    this.updateSelection(selection);
  }

  @action updateSelection(selection: ISelection) {
    const [$start, $end] = this.normalizePositionRows(selection.start, selection.end);
    const start = this.store.cursor.getActualCursorPosition($start.row, $start.column);
    const end = this.store.cursor.getActualCursorPosition($end.row, $end.column);
    const codeLines = this.store.code.codeLines;
    const affectedLines = codeLines.slice(start.row, end.row + 1);
    const isSameRow = start.row === end.row;

    if (isSameRow) {
      const [startCol, endCol] = this.normalizePositionColumns(start, end);
      const length = endCol.column - startCol.column;
      const lines = [{ row: startCol.row, columnStart: startCol.column, columnEnd: endCol.column }];
      selection.length = length;
      selection.lines = lines;
    } else {
      const lines: ISelectionLine[] = [];
      let length = 0;
      for (const [i, line] of affectedLines.entries()) {
        const row = start.row + i;
        switch (row) {
          case start.row:
            length += line.length - start.column;
            lines.push({ row, columnStart: start.column, columnEnd: line.length });
            break;
          case end.row:
            length += end.column;
            lines.push({ row, columnStart: 0, columnEnd: end.column });
            break;
          default:
            length += line.length;
            lines.push({ row, columnStart: 0, columnEnd: line.length });
        }
      }
      selection.length = length;
      selection.lines = lines;
    }
  }

  @action addSelectionRange(start: number, end: number) {
    const codeLines = this.store.code.codeLines;
    const length = end - start;
    const startPos = this.getRangeStartPosition(start);
    const affectedLines = codeLines.slice(startPos.row);
    let lines: ISelectionLine[] = [];
    let endPos: IPosition, len = length;

    for (const [i, line] of affectedLines.entries()) {
      const row = startPos.row + i;
      const columnStart = startPos.row === row ? startPos.column : 0;

      if (line.length - columnStart >= len) {
        lines.push({ row, columnStart, columnEnd: columnStart + len });
        break;
      }

      lines.push({ row, columnStart, columnEnd: line.length });
      len -= line.length - columnStart;
    }
    this.items.push({ start: startPos, end: endPos, length, lines });
  }

  @action setSelection(start: IPosition, end: IPosition) {
    this.removeAll();
    this.addSelection(start, end);
  }

  @action setSelectionRange(start: number, end: number) {
    this.removeAll();
    this.addSelectionRange(start, end);
  }

  @action removeSelection(selection: ISelection) {
    this.items = this.items.filter(item => item !== selection);
  }

  @action removeSelectionByCoords(start: IPosition, end: IPosition) {
    this.items = this.items.filter(item => (
      item.start.row !== start.row ||
      item.start.column !== start.column ||
      item.end.row !== end.row ||
      item.end.column !== end.column
    ));
  }

  @action removeAll() {
    this.items = [];
  }

  @action startCapture(e: MouseEvent) {
    const pos = this.store.cursor.getCursorPositionByCoords(e);
    this.items.push({ start: pos, end: pos, length: 0, lines: [] });
    this.captured = this.getSelection(pos, pos);
  }

  @action updateCapture(e: MouseEvent) {
    if (!this.captured) return;
    const pos = this.store.cursor.getCursorPositionByCoords(e);
    this.captured.end = pos;
    this.updateSelection(this.captured);
  }

  @action stopCapture(_: MouseEvent) {
    if (!this.captured) return;
    if (this.isSelectionEmpty(this.captured)) {
      this.removeSelection(this.captured);
    }
    this.captured = null;
  }

  private normalizePositionRows(start: IPosition, end: IPosition) {
    return [start, end].sort((a, b) => a.row - b.row);
  }

  private normalizePositionColumns(start: IPosition, end: IPosition) {
    return [start, end].sort((a, b) => a.column - b.column);
  }

  private getRangeStartPosition(start: number): IPosition {
    let index = 0, codeLines = this.store.code.codeLines;
    while (start > codeLines[index].length) {
      start -= codeLines[index].length;
      index++;
    }
    return { row: index, column: start };
  }
}
