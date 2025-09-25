import * as React from 'react';
import type { ThreeboxRef } from '../threebox/create-ref';
import { ThreeboxContext } from './threebox';

export type MountedThreeboxContextValue = {
  threeboxes: { [id: string]: ThreeboxRef };
  mountThreebox: (tb: ThreeboxRef, id: string | undefined) => void;
  unmountThreebox: (id: string | undefined) => void;
};

export const MountedThreeboxContext = React.createContext<MountedThreeboxContextValue | null>(null);

export const ThreeboxProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [threeboxes, setThreeboxes] = React.useState<{ [id: string]: ThreeboxRef }>({});

  const mountThreebox = React.useCallback((tb: ThreeboxRef, id: string | undefined = 'default') => {
    setThreeboxes((currTbs) => {
      if (id === 'current') {
        throw new Error('"current" cannot be used as a Threebox id');
      }
      if (currTbs[id]) {
        throw new Error(`Multiple Threebox instances with the same id: ${id}`);
      }
      return { ...currTbs, [id]: tb };
    });
  }, []);

  const unmountThreebox = React.useCallback((id: string | undefined = 'default') => {
    setThreeboxes((currTbs) => {
      if (!!currTbs[id]) {
        const nextTbs = { ...currTbs };
        delete nextTbs[id];
        return nextTbs;
      }
      return currTbs;
    });
  }, []);

  return (
    <MountedThreeboxContext.Provider
      value={{
        threeboxes,
        mountThreebox,
        unmountThreebox,
      }}
    >
      {children}
    </MountedThreeboxContext.Provider>
  );
};

export type ThreeboxCollection = {
  [id: string]: ThreeboxRef | undefined;
  current?: ThreeboxRef;
};

export const useThreebox = (): ThreeboxCollection => {
  const tbs = React.useContext(MountedThreeboxContext)?.threeboxes;
  const currTb = React.useContext(ThreeboxContext);

  const tbsWithCurrent = React.useMemo(() => {
    return { ...tbs, current: currTb?.threebox };
  }, [tbs, currTb]);

  return tbsWithCurrent as ThreeboxCollection;
};
