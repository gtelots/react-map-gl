import * as React from 'react';
import { flushSync } from 'react-dom';
import type { ModelLoaderOptions } from '../types/common';
import type { ThreeboxInstance } from '../types/lib';
import { ThreeboxContext } from './threebox';
import { deepEqual } from '../../../utils/deep-equal';
import assert from '../../../utils/assert';

export type ModelLoaderProps = ModelLoaderOptions & {
  children?: React.ReactNode;
  onLoad?: (model: any) => void;
  onError?: (error: any) => void;
};

const updateModel = (
  tb: ThreeboxInstance,
  props: ModelLoaderOptions,
  prevProps: ModelLoaderOptions,
  model: any,
) => {
  assert(props.id === prevProps.id, 'model id changed');

  if (
    props.type !== prevProps.type ||
    props.obj !== prevProps.obj ||
    props.units !== prevProps.units
  ) {
    console.warn('Model properties changed, reloading the model');
    model.dispose();
    return null;
  }

  if (!deepEqual(props.rotation, prevProps.rotation)) {
    model.setRotationAxis(props.rotation);
  }
  if (!deepEqual(props.scale, prevProps.scale)) {
    const unitsPerMeter = Number(model.unitsPerMeter);
    if (typeof props.scale === 'number') {
      const s = unitsPerMeter * props.scale;
      model.scale.set(s, s, s);
    } else if (typeof props.scale === 'object') {
      const newScale = Object.fromEntries(
        Object.entries(props.scale).map(([key, value]) => [key, unitsPerMeter * value]),
      );
      model.scale.set(newScale.x, newScale.y, newScale.z);
    }
  }
  if (props.anchor !== prevProps.anchor) {
    model.setAnchor(props.anchor);
  }
  if (deepEqual(props.feature, prevProps.feature)) {
    model.userData.feature = props.feature;
  }
  model.userData.model = { ...props };
  return model;
};

const updateDupModels = (
  tb: ThreeboxInstance,
  props: ModelLoaderOptions,
  prevProps: ModelLoaderOptions,
  dupModelsRef: React.RefObject<Map<string, any>>,
) => {
  dupModelsRef.current.forEach((dupModel, key) => {
    try {
      const id = props.id as string;
      if (dupModel?.userData?.model?.id === id) {
        updateModel(tb, props, prevProps, dupModel);
      }
    } catch (e) {
      console.warn(`Error updating duplicate model ${key}:`, e);
    }
  });
};

const createModel = async (tb: ThreeboxInstance, props: ModelLoaderOptions) => {
  if (tb) {
    const model = await tb.loadObj(props);
    model.userData.model = { ...props };
    model.userData.isRendered = false;
    return model;
  }
  return null;
};

const getModelById = (tb: ThreeboxInstance, id: string) => {
  return tb?.world.children.find((child: any) => {
    return child.userData.model.id === id;
  });
};

let modelCounter = 0;
const defaultProps: ModelLoaderOptions = {
  id: `model-${modelCounter++}`,
  type: 'glb',
  obj: '',
  units: 'meters',
  rotation: { x: 90, y: 180, z: 0 },
  scale: 1,
  anchor: 'auto',
  bbox: false,
  clone: true,
};

export const ModelLoader: React.FC<ModelLoaderProps> = ({
  children,
  onLoad,
  onError,
  ...props
}) => {
  const { threebox, map } = React.useContext(ThreeboxContext) || {};
  const tb = threebox?.getThreebox();
  const propsRef = React.useRef<ModelLoaderProps>({} as ModelLoaderProps);
  const dupModelsRef = React.useRef<Map<string, any>>(new Map());
  const [modelInstance, setModelInstance] = React.useState<any>(null);

  const loaderProps = React.useMemo(() => {
    const newProps = { ...props };
    delete newProps.mtl;
    delete newProps.bin;
    delete newProps.adjustment;
    delete newProps.normalize;
    delete newProps.tooltip;
    delete newProps.bbox;
    delete newProps.raycasted;
    delete newProps.clone;
    delete newProps.defaultAnimation;
    return { ...defaultProps, ...newProps };
  }, [
    props.anchor,
    props.feature,
    props.id,
    props.obj,
    props.rotation,
    props.scale,
    props.type,
    props.units,
  ]);

  const cleanupDupModels = React.useCallback(() => {
    dupModelsRef.current.forEach((dupModel) => {
      try {
        dupModel.dispose();
      } catch (e) {
        console.warn('Error disposing duplicate model:', e);
      }
    });
    dupModelsRef.current.clear();
  }, []);

  const loadModel = React.useCallback(async () => {
    if (!tb) return;
    const id = loaderProps.id as string;
    let model: any = map && map.style && map.style._loaded && getModelById(tb, id);
    let needsNewDupModels = false;

    try {
      if (model) {
        // Update main model
        model = updateModel(tb, loaderProps, propsRef.current, model);

        // If main model was disposed (props changed requiring recreation)
        if (model) {
          // Update main model and all duplicate models
          updateDupModels(tb, loaderProps, propsRef.current, dupModelsRef);
        } else {
          // Model was disposed, need to create new one and regenerate duplicates
          model = await createModel(tb, loaderProps);
          needsNewDupModels = true;
        }
      } else {
        // No existing model, create new one
        model = await createModel(tb, loaderProps);
        needsNewDupModels = true;
      }

      if (needsNewDupModels) {
        cleanupDupModels();
        flushSync(() => setModelInstance(null));
        setModelInstance(model);
      }

      onLoad?.(model);
      propsRef.current = loaderProps;
    } catch (error) {
      console.error(`Error loading model ${id}:`, error);
      onError?.(error);
    } finally {
      if (!needsNewDupModels) {
        setModelInstance(model || null);
      }
    }
  }, [tb, map, loaderProps, onLoad, onError, cleanupDupModels]);

  React.useEffect(() => {
    loadModel();
  }, [loadModel]);

  React.useEffect(() => {
    return () => {
      cleanupDupModels();
    };
  }, [cleanupDupModels]);

  const childrenWithModel = React.useMemo(() => {
    if (!modelInstance) {
      return null;
    }

    return React.Children.map(children, (child) => {
      if (child && React.isValidElement(child)) {
        const childProps = child.props as any;
        const childKey = childProps.id || child.key;
        let dupModel = dupModelsRef.current.get(childKey);

        if (!dupModel) {
          dupModel = modelInstance?.duplicate();
          dupModelsRef.current.set(childKey, dupModel);
        }
        return React.cloneElement(child as React.ReactElement<any>, { model: dupModel });
      }
      return child;
    });
  }, [modelInstance, children]);

  return childrenWithModel;
};
