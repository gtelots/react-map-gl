// useLayoutEffect but does not trigger warning in server-side rendering
import { useEffect, useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect = typeof document !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
