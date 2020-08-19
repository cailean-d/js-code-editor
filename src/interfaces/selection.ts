import { IPosition } from '@/interfaces/measure';

export interface ISelection {
  start: IPosition;
  end: IPosition;
  length: number;
  lines: ISelectionLine[];
}

export interface ISelectionLine {
  row: number;
  columnStart: number;
  columnEnd: number;
  extraSpace?: boolean;
  corners?: ISelectionCorners;
}

export interface ISelectionCorners {
  leftTop: boolean;
  leftBottom: boolean;
  rightTop: boolean;
  rightBottom: boolean;
  negativeLeftBottom: boolean;
  negativeRightTop: boolean;
  negativeRightBottom: boolean;
}
