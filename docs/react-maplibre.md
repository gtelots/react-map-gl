# React MapLibre Module Documentation

The React MapLibre module provides enhanced components and utilities for working with MapLibre maps in React applications.

## Overview

This module extends the standard `react-map-gl` library with additional components and utilities specifically designed for MapLibre integration.

## Components

### CustomLayer

A React component wrapper for MapLibre's custom layer functionality, allowing you to add custom rendering layers to your map.

#### Props

| Property    | Type                                                       | Required | Description                                       |
| ----------- | ---------------------------------------------------------- | -------- | ------------------------------------------------- |
| `id`        | `string`                                                   | ✓        | Unique identifier for the layer                   |
| `beforeId`  | `string`                                                   |          | ID of the layer before which to insert this layer |
| `children`  | `ReactNode`                                                |          | Child components to render within the layer       |
| `onAdd`     | `(map: MapboxInstance, gl: WebGLRenderingContext) => void` |          | Callback when layer is added to map               |
| `onRemove`  | `() => void`                                               |          | Callback when layer is removed from map           |
| `render`    | `() => void`                                               | ✓        | Render function called on each frame              |
| `onUnmount` | `() => void`                                               |          | Cleanup callback when component unmounts          |

#### Usage Example

```tsx
import { CustomLayer } from '@gtelots/react-map-gl';

<CustomLayer
  id="my-custom-layer"
  beforeId="existing-layer-id"
  onAdd={(map, gl) => {
    // Initialize your custom layer
    console.log('Layer added to map');
  }}
  onRemove={() => {
    // Cleanup when layer is removed
    console.log('Layer removed from map');
  }}
  render={() => {
    // Custom rendering logic
  }}
>
  {/* Optional child components */}
</CustomLayer>;
```

### PopupAnimation

A component that provides animated popup functionality for MapLibre maps.

#### Features

- Smooth animations for popup show/hide
- Customizable animation duration and easing
- Support for different animation types

#### Usage Example

```tsx
import { PopupAnimation } from '@gtelots/react-map-gl';

<PopupAnimation>
  <div>Popup content with smooth animations</div>
</PopupAnimation>;
```

### LineAnimation

A component that provides animated line drawing functionality for MapLibre maps.

#### Props

| Property  | Type     | Required | Description                                             |
| --------- | -------- | -------- | ------------------------------------------------------- |
| `map`     | `Map`    | ✓        | MapLibre map instance                                   |
| `layerId` | `string` | ✓        | ID of the line layer to animate                         |
| `speed`   | `number` |          | Animation speed (recommended range: 1-100, default: 50) |

#### Usage Example

```tsx
import { useLineAnimation } from '@gtelots/react-map-gl';

useLineAnimation({ map, layerId: 'my-line-layer', speed: 50 });
```

## Integration with Map

The react-maplibre components are designed to work within the broader map ecosystem. They should be used inside a `Map` context.

```tsx
import { Map } from 'react-map-gl/maplibre';
import { CustomLayer, PopupAnimation } from '@gtelots/react-map-gl';

<Map style="mapbox://styles/mapbox/streets-v11" id="default">
  <PopupAnimation>
    <div>Popup content with smooth animations</div>
  </PopupAnimation>
</Map>;
```

## Next Steps

- For 3D model integration, see [React Threebox Documentation](./react-threebox.md)
- For advanced visual effects, see [React ThreeJS Documentation](./react-threejs.md)
- For complete examples, see [Main Documentation](./README.md)
