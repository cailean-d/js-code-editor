import React from 'react';
import { IStore } from '@/interfaces/store';
import Cursor from '@/store/cursor';

export const StoreContext = React.createContext<IStore>(null);

export function createStore(): IStore {
  return {
    cursor: new Cursor()
  }
}
