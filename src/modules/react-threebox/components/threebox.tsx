import * as React from 'react';
import { useMap } from 'react-map-gl/maplibre';
import type { ThreeboxPluginOptions } from '../types/lib';
import type { ThreeboxRef } from '../threebox/create-ref';
import type { MapboxInstance } from '../../react-maplibre/types/lib';
import { createThreeboxRef } from '../threebox/create-ref';
import { MountedThreeboxContext } from './use-threebox';
import ThreeboxPlugin from '../threebox/threebox-plugin';
import { deepEqual } from '../../../utils/deep-equal';
import useIsomorphicLayoutEffect from '../../../utils/use-isomorphic-layout-effect';

export type ThreeboxContextValue = {
  map?: MapboxInstance;
  threebox?: ThreeboxRef;
};

export const ThreeboxContext = React.createContext<ThreeboxContextValue | null>(null);

export type ThreeboxProps = ThreeboxPluginOptions & {
  id?: string;
  mapId?: string;
  children?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
};

const defaultOptions: ThreeboxProps = {
  defaultLights: true,
  enableSelectingFeatures: true,
  enableSelectingObjects: true,
  enableDraggingObjects: false,
  enableRotatingObjects: false,
  enableTooltips: false,
  enableHelpTooltips: false,
  multiLayer: true,
  orthographic: false,
  cache: {
    cacheName: 'threebox-models',
    maxAge: 1 * 24 * 60 * 60 * 1000,
    maxCacheEntries: 200,
  },
};

const _Threebox = (props: ThreeboxProps, ref: React.Ref<ThreeboxRef>) => {
  const { id, mapId, children, onError, onLoad, ...options } = props;
  const mapRef = useMap();
  const mountedThreeboxContext = React.useContext(MountedThreeboxContext);
  const [tbInstance, setTbInstance] = React.useState<ThreeboxPlugin | null>(null);
  const initialOptionsRef = React.useRef<ThreeboxPluginOptions>(options);
  const { current: contextValue } = React.useRef<ThreeboxContextValue>({
    threebox: undefined,
    map: undefined,
  });

  const tbOptions = React.useMemo(() => {
    const newOptions = { ...options };
    delete newOptions.realSunlight;
    delete newOptions.realSunlightHelper;
    delete newOptions.sky;
    delete newOptions.terrain;
    return { ...defaultOptions, ...newOptions };
  }, [
    options.defaultLights,
    options.enableSelectingFeatures,
    options.enableSelectingObjects,
    options.enableDraggingObjects,
    options.enableRotatingObjects,
    options.enableTooltips,
    options.enableHelpTooltips,
    options.multiLayer,
    options.orthographic,
    options.cache?.cacheName,
    options.cache?.maxAge,
    options.cache?.maxCacheEntries,
  ]);

  React.useEffect(() => {
    let isMounted = true;
    let tbPlugin: ThreeboxPlugin | null = null;
    const mapInstance = mapRef?.[mapId || 'current']?.getMap();

    try {
      if (!isMounted) {
        return;
      }

      if (!tbPlugin) {
        mapInstance?.on('style.load', () => {
          tbPlugin = new ThreeboxPlugin(tbOptions, mapInstance);
          const tbRef = createThreeboxRef(tbPlugin);
          contextValue.threebox = tbRef;
          contextValue.map = mapInstance;
          onLoad?.();
          setTbInstance(tbPlugin);
          mountedThreeboxContext?.mountThreebox(contextValue.threebox!, id);
        });
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
      if (tbPlugin) {
        mountedThreeboxContext?.unmountThreebox(id);
        tbPlugin.destroy();
      }
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (tbInstance && initialOptionsRef.current) {
      if (!deepEqual(options, initialOptionsRef.current)) {
        mountedThreeboxContext?.unmountThreebox(id);
        tbInstance.destroy();
        throw new Error('Threebox props cannot be changed after initialization');
      }
    }
  }, [options, tbInstance]);

  React.useImperativeHandle(ref, () => contextValue.threebox!, [tbInstance]);

  return (
    tbInstance && (
      <ThreeboxContext.Provider value={contextValue}>{children}</ThreeboxContext.Provider>
    )
  );
};

export const Threebox = React.forwardRef(_Threebox);
