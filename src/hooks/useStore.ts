import { useContext } from 'react';
import { StoreContext } from '@/utils/store';
import { IStore } from '@/interfaces/store';

export default function useStore(): IStore {
  return useContext(StoreContext);
}
