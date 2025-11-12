# React Threebox Module Documentation

The React Threebox module provides 3D model rendering capabilities for MapLibre maps using the Threebox library.

## Overview

This module enables you to add and manage 3D models, objects, and interactive elements on MapLibre maps through a React component interface.

## Core Components

### ThreeboxProvider

The root provider component that manages all Threebox instances in your application.

#### Features

- Manages multiple Threebox instances with unique IDs
- Provides context for accessing Threebox instances throughout the component tree
- Handles lifecycle and cleanup automatically

#### Usage

```tsx
import { ThreeboxProvider } from '@gtelots/react-map-gl';

<ThreeboxProvider>{/* Your map and Threebox components */}</ThreeboxProvider>;
```

### Threebox

The main Threebox component that initializes and configures a Threebox instance on a map.

#### Props

| Property                  | Type                     | Default     | Description                                  |
| ------------------------- | ------------------------ | ----------- | -------------------------------------------- |
| `id`                      | `string`                 | `"default"` | Unique identifier for this Threebox instance |
| `mapId`                   | `string`                 | `"current"` | ID of the map to attach Threebox to          |
| `defaultLights`           | `boolean`                | `true`      | Enable default lighting in the scene         |
| `enableSelectingFeatures` | `boolean`                | `true`      | Allow selecting map features                 |
| `enableSelectingObjects`  | `boolean`                | `true`      | Allow selecting 3D objects                   |
| `enableDraggingObjects`   | `boolean`                | `false`     | Allow dragging 3D objects                    |
| `enableRotatingObjects`   | `boolean`                | `false`     | Allow rotating 3D objects                    |
| `enableTooltips`          | `boolean`                | `false`     | Enable object tooltips                       |
| `enableHelpTooltips`      | `boolean`                | `false`     | Enable help tooltips                         |
| `multiLayer`              | `boolean`                | `true`      | Support multiple Threebox layers             |
| `orthographic`            | `boolean`                | `false`     | Use orthographic camera projection           |
| `cache`                   | `CacheOptions`           | See below   | Model caching configuration                  |
| `onLoad`                  | `() => void`             |             | Callback when Threebox is initialized        |
| `onError`                 | `(error: Error) => void` |             | Error callback                               |

#### Cache Options

```typescript
{
  cacheName: 'threebox-models',
  maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  maxCacheEntries: 200
}
```

#### Usage Example

```tsx
import { Threebox } from '@gtelots/react-map-gl';

<Threebox
  id="main-threebox"
  defaultLights={true}
  enableSelectingObjects={true}
  enableDraggingObjects={false}
  onLoad={() => console.log('Threebox initialized')}
  onError={(error) => console.error('Threebox error:', error)}
>
  {/* Threebox layers and objects */}
</Threebox>;
```

### ThreeboxLayer

A component that creates a layer for organizing 3D objects within a Threebox instance.

#### Props

| Property   | Type        | Required | Description                                       |
| ---------- | ----------- | -------- | ------------------------------------------------- |
| `id`       | `string`    | ✓        | Unique identifier for the layer                   |
| `children` | `ReactNode` |          | 3D objects and components to render in this layer |

#### Usage Example

```tsx
import { ThreeboxLayer } from '@gtelots/react-map-gl';

<ThreeboxLayer id="model-layer">{/* 3D models and objects */}</ThreeboxLayer>;
```

### Model Components

#### ModelLoader

Loads and manages 3D models from various file formats.

#### Props

| Property  | Type                                 | Required | Description                            |
| --------- | ------------------------------------ | -------- | -------------------------------------- |
| `id`      | `string`                             |          | Unique identifier for the model loader |
| `obj`     | `string`                             | ✓        | URL or path to the 3D model file       |
| `type`    | `string`                             | ✓        | Model type (GLB, GLTF, OBJ, etc.)      |
| `anchor`  | `string`                             |          | Anchor point for the model             |
| `scale`   | `number \| [number, number, number]` |          | Scale factor for the model             |
| `onLoad`  | `(model: Object3D) => void`          |          | Callback when model is loaded          |
| `onError` | `(error: Error) => void`             |          | Error callback                         |

#### Usage Example

```tsx
import { ModelLoader } from '@gtelots/react-map-gl';

<ModelLoader
  id="building-model"
  obj="/models/building.glb"
  type="glb"
  scale={1}
  onLoad={(model) => console.log('Model loaded:', model)}
/>;
```

#### ModelRenderer

Renders multiple models efficiently.

#### Props

| Property               | Type                        | Required | Description                                   |
| ---------------------- | --------------------------- | -------- | --------------------------------------------- |
| `id`                   | `string`                    |          | Unique identifier for the model renderer      |
| `coords`               | `[number, number, number]`  |          | Position coordinates [lng, lat, altitude]     |
| `rotation`             | `[number, number, number]`  |          | Rotation in degrees [x, y, z]                 |
| `visibility`           | `boolean`                   |          | Toggle model visibility                       |
| `hidden`               | `boolean`                   |          | Hide the model without removing it            |
| `wireframe`            | `boolean`                   |          | Render model in wireframe mode                |
| `animationOptions`     | See below                   |          | Animation configuration                       |
| `pathOptions`          | See below                   |          | Follow path configuration                     |
| `renderingEffect`      | See below                   |          | Rendering effect configuration                |
| `onSelectedChanged`    | `(e: any) => void`          |          | Callback when model selection state changes   |
| `onObjectMouseOver`    | `(e: any) => void`          |          | Callback when mouse hovers over the model     |
| `onObjectMouseOut`     | `(e: any) => void`          |          | Callback when mouse leaves the model          |
| `onWireframedChanged`  | `(e: any) => void`          |          | Callback when wireframe state changes         |
| `onIsPlayingChanged`   | `(e: any) => void`          |          | Callback when animation play state changes    |
| `onFollowPathFinished` | `(e: any) => void`          |          | Callback when follow path animation completes |
| `onRender`             | `(model: Object3D) => void` |          | Callback after each model is rendered         |

#### Animation Options

```typescript
{
  animation: 0,
  duration: 1000,
  speed: 1
}
```

#### Follow Path Options

```typescript
{
  path: [[lng, lat, alt], [lng, lat, alt], ...],
  duration: 1000,
  trackHeading: true,
}
```

#### Rendering Effect Options

```typescript
{
  duration: 250,
  easing: (t: number) => t,
}
```

#### Usage Example

```tsx
import { ModelLoader, ModelRenderer } from '@gtelots/react-map-gl';

<ModelLoader
  id="building-model"
  obj="/models/building.glb"
  type="glb"
  scale={1}
  onLoad={(model) => console.log('Model loaded:', model)}
>
  <ModelRenderer
    id="building-instance-1"
    coords={[-74.006, 40.7128, 0]}
    rotation={[0, 45, 0]}
    renderingEffect={{ duration: 500 }}
    onRender={(model) => console.log('Model instance 1 rendered:', model)}
  />
  <ModelRenderer
    id="building-instance-2"
    coords={[-74.007, 40.7129, 0]}
    rotation={[0, 90, 0]}
    renderingEffect={{ duration: 500 }}
    onRender={(model) => console.log('Model instance 2 rendered:', model)}
  />
</ModelLoader>;
```

#### ModelBatcher

Optimizes rendering of multiple similar models by grouping them into efficient batches.

#### Usage Example

```tsx
import { ModelBatcher } from '@gtelots/react-map-gl';

const models = [
  {
    loader: {
      id: '/model3ds/building.glb',
      type: 'glb',
      obj: '/model3ds/building.glb',
      scale: 0.5,
      anchor: 'auto',
    },
    renderers: [
      {
        id: 'fc7699e8-d5d1-4dc0-95bf-7fbb816f9cfe',
        coords: [105.804230475, 20.997142163],
        rotation: {
          x: 0,
          y: 0,
          z: 0,
        },
        renderingEffect: {
          duration: 500,
        },
      },
      {
        id: '09403019-2917-48d0-8195-66c34bb42d83',
        coords: [105.804244162, 20.99712239],
        rotation: {
          x: 0,
          y: 0,
          z: 0,
        },
        renderingEffect: {
          duration: 500,
        },
      },
      {
        id: '176c3b52-2c9e-4a76-bd23-d18ac628a4e3',
        coords: [105.804315244, 20.997051286],
        rotation: {
          x: 0,
          y: 0,
          z: 0,
        },
        renderingEffect: {
          duration: 500,
        },
      },
    ],
  },
  {
    loader: {
      id: '/model3ds/camera.glb',
      type: 'glb',
      obj: '/model3ds/camera.glb',
      scale: 4,
      anchor: 'auto',
    },
    renderers: [
      {
        id: '59c5d35c-c251-4c67-a7d5-07aa719b19f9',
        coords: [105.804260796, 20.997270746],
        rotation: {
          x: 0,
          y: 0,
          z: 35,
        },
        renderingEffect: {
          duration: 500,
        },
      },
      {
        id: '49013a1a-8693-46e7-bb6d-633ad43f07d1',
        coords: [105.804165803, 20.997427978],
        rotation: {
          x: 0,
          y: 0,
          z: 125,
        },
        renderingEffect: {
          duration: 500,
        },
      },
      {
        id: 'cd37d738-f31b-4bbd-b38a-0af9c96f9203',
        coords: [105.8040236, 20.997384585],
        rotation: {
          x: 0,
          y: 0,
          z: 215,
        },
        renderingEffect: {
          duration: 500,
        },
      },
    ],
  },
];

<ModelBatcher models={models} batchSize={5} batchDelay={100} />;
```

## Hooks

### useThreebox

A hook that provides access to Threebox instances from any component within the ThreeboxProvider.

#### Returns

```typescript
{
  [id: string]: ThreeboxRef | undefined;
  current?: ThreeboxRef; // Currently active Threebox instance
}
```

#### Usage Example

```tsx
import { useThreebox } from '@gtelots/react-map-gl';

function MyComponent() {
  const threeboxes = useThreebox();

  // Access default Threebox instance
  const defaultThreebox = threeboxes.default;

  // Access current active Threebox
  const currentThreebox = threeboxes.current;

  // Access specific Threebox by ID
  const specificThreebox = threeboxes['my-threebox-id'];

  return <div>Component using Threebox</div>;
}
```

## Next Steps

- For visual effects integration, see [React ThreeJS Documentation](./react-threejs.md)
- For complete examples, see [Main Documentation](./README.md)
