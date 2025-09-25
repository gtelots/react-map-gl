import * as React from 'react';
import type { CustomLayerProps } from '../../react-maplibre/components/custom-layer';
import { CustomLayer } from '../../react-maplibre/components/custom-layer';
import { ThreeboxContext } from './threebox';

export type ThreeboxLayerProps = Pick<CustomLayerProps, 'id' | 'beforeId' | 'children'> & {};

export type ThreeboxLayerContextValue = {
  layerId: string;
};

export const ThreeboxLayerContext = React.createContext<ThreeboxLayerContextValue | null>(null);

let layerCounter = 0;

export const ThreeboxLayer: React.FC<ThreeboxLayerProps> = ({ id, beforeId, children }) => {
  const { threebox } = React.useContext(ThreeboxContext) || {};
  const tb = threebox?.getThreebox();

  const layerId = React.useMemo(() => id || `threebox-layer-${layerCounter++}`, [id]);

  const mountFunction = React.useCallback(() => {
    if (tb) {
      tb.update();
      tb.map.repaint = true;
    }
  }, [tb]);

  const unmountFunction = React.useCallback(() => {
    if (tb) {
      tb.clear(layerId, true);
    }
  }, [tb, layerId]);

  const contextValue = React.useMemo(() => ({ layerId }), [layerId]);

  const layerProps = React.useMemo(
    () => ({
      onAdd: mountFunction,
      render: mountFunction,
      onRemove: unmountFunction,
      beforeId,
      id: layerId,
    }),
    [layerId, beforeId, mountFunction, unmountFunction],
  );

  return (
    <ThreeboxLayerContext.Provider value={contextValue}>
      <CustomLayer {...layerProps} onMount={mountFunction} onUnmount={unmountFunction}>
        {children}
      </CustomLayer>
    </ThreeboxLayerContext.Provider>
  );
};
