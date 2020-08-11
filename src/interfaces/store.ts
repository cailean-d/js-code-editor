import Cursor from '@/store/cursor';
import Options from '@/store/options';
import Measure from '@/store/measure';
import Code from '@/store/code';
import Gutter from '@/store/gutter';

export interface IStore {
  cursor?: Cursor;
  options?: Options;
  measure?: Measure;
  code?: Code;
  gutter?: Gutter;
}
