import * as React from 'react';
import { useMap } from 'react-map-gl/maplibre';
import type { EffectCanvasParams, EffectManagerContext } from '../types/common';
import { EffectManager } from '../threejs/graphics/effect-manager';
import { deepEqual } from '../../../utils/deep-equal';
import useIsomorphicLayoutEffect from '../../../utils/use-isomorphic-layout-effect';

export type EffectCanvasContextValue = EffectManagerContext;
export const EffectCanvasContext = React.createContext<EffectCanvasContextValue | null>(null);

export type EffectCanvasProps = EffectCanvasParams & {
  id?: string;
  mapId?: string;
  children?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
};

const _EffectCanvas = (props: EffectCanvasProps, ref: React.Ref<EffectCanvasContextValue>) => {
  const { id, mapId, children, onError, onLoad, ...options } = props;
  const mapRef = useMap();
  const [effectManager, setEffectManager] = React.useState<EffectManager | null>(null);
  const optionsRef = React.useRef<EffectCanvasParams>(options);
  const { current: contextValue } = React.useRef({} as EffectCanvasContextValue);

  const canvasOptions = React.useMemo(() => options, [Object.values(options).join(',')]);

  React.useEffect(() => {
    let isMounted = true;
    let effectInstance: EffectManager | null = null;
    const mapInstance = mapRef?.[mapId || 'current']?.getMap();

    try {
      if (!isMounted) {
        return;
      }

      if (!effectInstance) {
        effectInstance = new EffectManager(canvasOptions, mapInstance);
        const context = effectInstance.context;
        if (context) {
          contextValue.scene = context.scene;
          contextValue.camera = context.camera;
          contextValue.renderer = context.renderer;
          contextValue.group = context.group;
          contextValue.light = context.light;
          contextValue.bloom = context.bloom;
          contextValue.container = context.container;
        }
        onLoad?.();
        setEffectManager(effectInstance);
      }
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      } else {
        console.error(error);
      }
    }

    return () => {
      isMounted = false;
      if (effectInstance) {
        effectInstance.destroy();
      }
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (effectManager && optionsRef.current) {
      if (!deepEqual(options, optionsRef.current)) {
        effectManager.context?.bloom?.setValues(options!);
      }
      optionsRef.current = options;
    }
  }, [options, effectManager]);

  React.useImperativeHandle(ref, () => contextValue, [effectManager]);

  return (
    effectManager && (
      <EffectCanvasContext.Provider value={contextValue}>{children}</EffectCanvasContext.Provider>
    )
  );
};

export const EffectCanvas = React.forwardRef(_EffectCanvas);
