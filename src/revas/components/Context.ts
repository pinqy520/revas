import { createContext } from 'react';

export interface AppContextType {
  clientWidth: number;
  clientHeight: number;
  deviceRatio: number;
}

export const AppContext = createContext<AppContextType>({
  clientWidth: 0,
  clientHeight: 0,
  deviceRatio: 1,
});

export function withContext<T>(comp: T): T {
  (comp as any).contextType = AppContext;
  return comp;
}
