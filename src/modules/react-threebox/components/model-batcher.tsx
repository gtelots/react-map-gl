import * as React from 'react';
import type { ModelLoaderProps } from './model-loader';
import type { ModelRendererProps } from './model-renderer';
import type { ModelBatchItem } from '../types/common';
import { ModelRenderer } from './model-renderer';
import { ModelLoader } from './model-loader';

export interface ModelBatcherProps {
  models: ModelBatchItem[];
  batchSize?: number;
  batchDelay?: number;
}

export interface BatchedModelProps {
  batchIndex: number;
  batchSize: number;
  batchDelay: number;
}

export interface BatchedModelRendererProps extends ModelRendererProps, BatchedModelProps {}
export interface BatchedModelLoaderProps extends ModelLoaderProps, BatchedModelProps {}

const useShouldRender = (batchIndex: number, batchSize: number, batchDelay: number) => {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    const delay = Math.floor(batchIndex / batchSize) * batchDelay;
    const timer = setTimeout(() => setShouldRender(true), delay);
    return () => clearTimeout(timer);
  }, [batchIndex, batchSize, batchDelay]);

  return shouldRender;
};

const BatchedModelRenderer: React.FC<BatchedModelRendererProps> = ({
  batchIndex,
  batchSize,
  batchDelay,
  ...props
}) => {
  const shouldRender = useShouldRender(batchIndex, batchSize, batchDelay);
  if (!shouldRender) return null;
  return <ModelRenderer {...props} />;
};

const BatchedModelLoader: React.FC<BatchedModelLoaderProps> = ({
  batchIndex,
  batchSize,
  batchDelay,
  ...props
}) => {
  const shouldRender = useShouldRender(batchIndex, batchSize, batchDelay);
  if (!shouldRender) return null;
  return <ModelLoader {...props} />;
};

export const ModelBatcher: React.FC<ModelBatcherProps> = ({
  models,
  batchSize = 10,
  batchDelay = 100,
}) => {
  return models.map((model, loaderIndex) => (
    <BatchedModelLoader
      key={model.loader.id}
      {...(model.loader as ModelLoaderProps)}
      batchIndex={loaderIndex}
      batchSize={batchSize}
      batchDelay={batchDelay}
    >
      {model.renderers.map((props, renderIndex) => (
        <BatchedModelRenderer
          key={props.id}
          {...(props as ModelRendererProps)}
          batchIndex={renderIndex}
          batchSize={batchSize}
          batchDelay={batchDelay}
        />
      ))}
    </BatchedModelLoader>
  ));
};
