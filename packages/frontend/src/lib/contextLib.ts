import { createContext, useContext } from 'react';

export interface AppContextType {
  isAuthenticated: boolean;
  userHasAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  // eslint-disable-next-line no-use-before-define
  userHasAuthenticated: useAppContext,
});

export function useAppContext() {
  return useContext(AppContext);
}
