import { observable, computed, action } from 'mobx';
import { IStore } from '@/interfaces/store';
import { ISelection } from '@/interfaces/selection';
import { IPosition } from '@/interfaces/measure';
import { ISelectionLine } from '@/interfaces/selection';
import { ICursor } from '@/interfaces/cursor';

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
    this.store.cursor.addCursor(selection.end.row, selection.end.column);
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
        endPos = { row, column: columnStart + len };
        break;
      }

      lines.push({ row, columnStart, columnEnd: line.length });
      len -= line.length - columnStart;
    }
    this.items.push({ start: startPos, end: endPos, length, lines });
    this.store.cursor.addCursor(endPos.row, endPos.column);
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

  @action clearSelectionText() {
    for (const selection of this.items) {
      const cursor = this.getSelectionCursor(selection);
      const [start, end] = this.normalizePosition(selection.start, selection.end);
      const firstLine = this.store.code.codeLines[start.row];
      const lastLine = this.store.code.codeLines[end.row];
      const substr1 = firstLine.substring(0, start.column);
      const substr2 = lastLine.substring(end.column);
      this.store.code.codeLines[start.row] = substr1 + substr2;
      this.store.code.codeLines.splice(start.row + 1, selection.lines.length - 1);
      this.store.cursor.setCursor(cursor, start.row, start.column);
      this.rebaseSelections(selection);
    }
    this.removeAll();
  }

  @action rebaseSelections(_selection: ISelection) {
    const Voffset = _selection.lines.length - 1;
    const [_start, _end] = this.normalizePosition(_selection.start, _selection.end);
    for (const selection of this.items) {
      if (_selection === selection) continue;
      const cursor = this.getSelectionCursor(selection);
      const [start] = this.normalizePosition(selection.start, selection.end);
      const isBottomToTop = _end.row === start.row;
      const isLeftToRight = _end.column < start.column;

      if (isBottomToTop && isLeftToRight) {
        const Hoffset = _end.column - _start.column;
        this.moveFistLineLeft(selection, Hoffset);
        if (cursor.row === _end.row) {
          this.store.cursor.moveCursorLeft(cursor, Hoffset);
        }
      }

      if (_end.row <= start.row) {
        this.moveSelectionUp(selection, Voffset);
        this.store.cursor.moveCursorUp(cursor, Voffset);
      }
    }
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

  private normalizePosition(start: IPosition, end: IPosition) {
    return [start, end].sort((a, b) => a.row - b.row || a.column - b.column);
  }

  private getRangeStartPosition(start: number): IPosition {
    let index = 0, codeLines = this.store.code.codeLines;
    while (start > codeLines[index].length) {
      start -= codeLines[index].length;
      index++;
    }
    return { row: index, column: start };
  }

  private getSelectionCursor(selection: ISelection): ICursor {
    for (const cursor of this.store.cursor.items) {
      const start = cursor.row === selection.start.row && cursor.column === selection.start.column;
      const end = cursor.row === selection.end.row && cursor.column === selection.end.column;
      if (start || end) {
        return cursor;
      }
    }
  }

  private moveSelectionUp(selection: ISelection, offset = 1) {
    const firstLine = selection.lines[0];
    if (firstLine.row - offset < 0) return;
    for (const line of selection.lines) {
      line.row -= offset;
    }
    selection.start.row -= offset;
    selection.end.row -= offset;
  }

  private moveFistLineLeft(selection: ISelection, offset = 1) {
    const firstLine = selection.lines[0];
    const [start, end] = this.normalizePosition(selection.start, selection.end);
    if (firstLine.columnStart - offset < 0) return;
    firstLine.columnStart -= offset;
    firstLine.columnEnd -= offset;
    start.column -= offset;
    if (start.row === end.row)
      end.column -= offset;
  }
}
