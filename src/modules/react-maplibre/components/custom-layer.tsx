import * as React from 'react';
import { useMap } from 'react-map-gl/maplibre';
import type { mat4 } from 'gl-matrix';
import type { CustomLayerOptions, CustomRenderOptions, MapboxInstance } from '../types/lib';
import assert from '../../../utils/assert';
import useIsomorphicLayoutEffect from '../../../utils/use-isomorphic-layout-effect';

export type CustomLayerProps = Omit<CustomLayerOptions, 'type' | 'renderingMode'> & {
  beforeId?: string;
  children?: React.ReactNode;
  onMount?: () => void;
  onUnmount?: () => void;
};

const useLatestRef = <T,>(value: T) => {
  const ref = React.useRef(value);
  ref.current = value;
  return ref;
};

const updateCustomLayer = (
  map: MapboxInstance,
  id: string,
  props: Partial<CustomLayerProps>,
  prevProps: Partial<CustomLayerProps>,
) => {
  assert(props.id === prevProps.id, 'layer id changed');

  if (props.beforeId !== prevProps.beforeId) {
    map.moveLayer(id, props.beforeId);
  }
};

const createCustomLayer = (
  map: MapboxInstance,
  id: string,
  props: Partial<CustomLayerProps>,
  handlers: {
    onAddRef: React.RefObject<CustomLayerProps['onAdd']>;
    prerenderRef: React.RefObject<CustomLayerProps['prerender']>;
    renderRef: React.RefObject<CustomLayerProps['render']>;
    onRemoveRef: React.RefObject<CustomLayerProps['onRemove']>;
  },
) => {
  const layer: CustomLayerOptions = {
    id,
    type: 'custom',
    renderingMode: '3d',
    onAdd: (m: MapboxInstance, gl: WebGLRenderingContext) => {
      handlers.onAddRef.current?.(m, gl);
    },
    prerender: (gl: WebGLRenderingContext, matrix: mat4, options: CustomRenderOptions) => {
      handlers.prerenderRef.current?.(gl, matrix, options);
    },
    render: (gl: WebGLRenderingContext, matrix: mat4, options: CustomRenderOptions) => {
      handlers.renderRef.current?.(gl, matrix, options);
    },
    onRemove: (m: MapboxInstance, gl: WebGLRenderingContext) => {
      handlers.onRemoveRef.current?.(m, gl);
    },
  };

  // @ts-ignore
  map.addLayer(layer, props.beforeId);
};

let layerCounter = 0;

export const CustomLayer: React.FC<CustomLayerProps> = ({
  onAdd,
  prerender,
  render,
  onRemove,
  onMount,
  onUnmount,
  children,
  ...props
}) => {
  const map = useMap().current?.getMap();
  const propsRef = React.useRef(props);
  const [, setStyleLoaded] = React.useState(0);

  const id = React.useMemo(() => props.id || `custom-layer-${layerCounter++}`, []);
  const memorizedProps = React.useMemo(
    () => ({
      ...props,
      type: 'custom' as const,
      renderingMode: '3d' as const,
    }),
    [Object.values(props).join(',')],
  );

  const onAddRef = useLatestRef(onAdd);
  const prerenderRef = useLatestRef(prerender);
  const renderRef = useLatestRef(render);
  const onRemoveRef = useLatestRef(onRemove);

  React.useEffect(() => {
    if (!map) return;
    const forceUpdate = () => setStyleLoaded((v) => v + 1);
    map.on('styledata', forceUpdate);
    forceUpdate();
    onMount?.();

    return () => {
      map.off('styledata', forceUpdate);
      // @ts-ignore
      if (map.style && map.style._loaded && map.getLayer(id)) {
        map.removeLayer(id);
        onUnmount?.();
      }
    };
  }, [map, id, onMount, onUnmount]);

  // @ts-ignore
  useIsomorphicLayoutEffect(() => {
    if (!map) return;
    const layer = map.style && map.style._loaded && map.getLayer(id);

    if (layer) {
      updateCustomLayer(map, id, memorizedProps, propsRef.current);
    } else {
      createCustomLayer(map, id, memorizedProps, {
        onAddRef,
        prerenderRef,
        renderRef,
        onRemoveRef,
      });
    }
    propsRef.current = memorizedProps;
  }, [map, id, memorizedProps]);

  return children;
};
