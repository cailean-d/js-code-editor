import React from 'react';
import { IStore } from '@/interfaces/store';
import Cursor from '@/store/cursor';
import Options from '@/store/options';
import Measure from '@/store/measure';
import Code from '@/store/code';
import Gutter from '@/store/gutter';
import Selection from '@/store/selection';
import Reference from '@/store/reference';

export const StoreContext = React.createContext<IStore>(null);

export function createStore(): IStore {
  const store: IStore = {};
  store.options = new Options(store);
  store.measure = new Measure(store);
  store.code = new Code(store);
  store.gutter = new Gutter(store);
  store.cursor = new Cursor(store);
  store.selection = new Selection(store);
  store.reference = new Reference();
  return store;
}
