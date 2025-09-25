import * as React from 'react';
import { gsap } from 'gsap';
import type { ModelRendererOptions } from '../types/common';
import type { ThreeboxInstance } from '../types/lib';
import { ThreeboxContext } from './threebox';
import { deepEqual } from '../../../utils/deep-equal';
import { ThreeboxLayerContext } from './threebox-layer';
import updateProperties from '../../../utils/update-properties';
import useIsomorphicLayoutEffect from '../../../utils/use-isomorphic-layout-effect';

export type ModelRendererProps = ModelRendererOptions & {
  model?: any;
  layerId?: string;
  onRender?: (model: any) => void;
};

const pointerEvents = {
  SelectedChange: 'onSelectedChange',
  Wireframed: 'onWireframed',
  IsPlayingChanged: 'onIsPlayingChanged',
  ObjectDragged: 'onDraggedObject',
  ObjectMouseOver: 'onObjectMouseOver',
  ObjectMouseOut: 'onObjectMouseOut',
} as const;

const propertyNames = ['wireframe', 'visibility', 'hidden'] as (keyof ModelRendererOptions)[];

const addModel = (tb: ThreeboxInstance, props: ModelRendererOptions, model: any) => {
  const currentScale = model.scale.z;
  const originZ = currentScale / 2;
  const targetZ = currentScale;
  const renderingEffect = props.renderingEffect;

  if (renderingEffect) {
    model.scale.z = originZ;
  }

  setTimeout(() => {
    tb.add(model, props.layerId);
  }, 50);

  if (renderingEffect) {
    const duration = (renderingEffect.duration || 500) / 1000;
    const ease = renderingEffect.easing || ((t: number) => t);
    setTimeout(() => {
      gsap.to(model.scale, { z: targetZ, duration: duration, ease: ease });
    }, 100);
  }
};

const rerenderModel = (
  tb: ThreeboxInstance,
  props: ModelRendererOptions,
  prevProps: ModelRendererOptions,
  defaultProps: ModelRendererOptions,
  model: any,
) => {
  model.name = props.id;
  model = updateProperties(props, prevProps, defaultProps, model, propertyNames);

  if (props.coords && !deepEqual(props.coords, prevProps.coords)) {
    model.setCoords(props.coords);
  }

  if (props.rotation && !deepEqual(props.rotation, prevProps.rotation)) {
    model.setRotation(props.rotation);
  }

  if (props.scale && !deepEqual(props.scale, prevProps.scale)) {
    model.setScale(props.scale);
  }

  if (props.animationOptions && !deepEqual(props.animationOptions, prevProps.animationOptions)) {
    model.playAnimation(props.animationOptions);
  } else if (!props.animationOptions && prevProps.animationOptions) {
    model.stop();
  }

  if (props.pathOptions && !deepEqual(props.pathOptions, prevProps.pathOptions)) {
    model.followPath(props.pathOptions, props.onFollowPathFinish);
  } else if (!props.pathOptions && prevProps.pathOptions) {
    model.stop();
  }

  for (const eventName in pointerEvents) {
    const eveName = eventName as keyof typeof pointerEvents;
    const eventProps = props[pointerEvents[eveName] as keyof ModelRendererOptions];
    const prevEventProps = prevProps[pointerEvents[eveName] as keyof ModelRendererOptions];

    if (eventProps !== prevEventProps) {
      if (prevEventProps) {
        model.removeEventListener(eventName, prevEventProps);
      }
      if (eventProps) {
        model.addEventListener(eventName, eventProps, false);
      }
    }
  }
};

const defaultProps: ModelRendererOptions = {
  id: Math.random().toString(36).substring(2, 9),
  wireframe: false,
  visibility: true,
  hidden: false,
};

export const ModelRenderer: React.FC<ModelRendererProps> = ({ model, onRender, ...props }) => {
  const { threebox, map } = React.useContext(ThreeboxContext) || {};
  const { layerId } = React.useContext(ThreeboxLayerContext) || {};
  const tb = threebox?.getThreebox();
  const propsRef = React.useRef<ModelRendererProps>({} as ModelRendererProps);

  const renderProps = React.useMemo(
    () => ({
      ...defaultProps,
      ...props,
      layerId: layerId,
    }),
    [props, layerId],
  );

  useIsomorphicLayoutEffect(() => {
    if (model) {
      rerenderModel(tb!, renderProps, propsRef.current, defaultProps, model);

      const isRendered = model.userData.isRendered;
      if (!isRendered) {
        addModel(tb!, renderProps, model);
        model.userData.isRendered = true;
        onRender?.(model);
      }
    } else {
      throw new Error('Model not found in Threebox instance.');
    }

    propsRef.current = renderProps;
  }, [tb, model, onRender, renderProps]);

  React.useEffect(() => {
    return () => {
      if (tb) {
        tb.removeByName(props.id);
      }
    };
  }, [tb, props.id, map]);

  return null;
};
