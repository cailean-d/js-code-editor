import Cursor from '@/store/cursor';
import Options from '@/store/options';
import Measure from '@/store/measure';
import Code from '@/store/code';
import Gutter from '@/store/gutter';
import Selection from '@/store/selection';
import Reference from '@/store/reference';
import Keymap from '@/store/keymap';

export interface IStore {
  cursor?: Cursor;
  options?: Options;
  measure?: Measure;
  code?: Code;
  gutter?: Gutter;
  selection?: Selection;
  reference?: Reference;
  keymap?: Keymap;
}
