# React ThreeJS Module Documentation

The React ThreeJS module provides advanced visual effects and rendering capabilities for MapLibre maps using Three.js with bloom effects, extrusion, and custom materials.

## Overview

This module enables you to create stunning visual effects on your maps including:

- Bloom lighting effects for glowing lines and objects
- Extruded wall geometries with animated materials
- Custom shaders and post-processing effects
- Real-time rendering with WebGL
- Enhanced canvas management and effect compositing

## Core Components

### EffectCanvas

The main container component that manages Three.js rendering context and bloom effects for child components.

#### Props

| Property    | Type                     | Default        | Description                                                  |
| ----------- | ------------------------ | -------------- | ------------------------------------------------------------ |
| `id`        | `string`                 | Auto-generated | Unique identifier for the effect canvas                      |
| `mapId`     | `string`                 | `"current"`    | ID of the map to attach the canvas to                        |
| `threshold` | `number`                 | `0`            | Bloom threshold (0-1) - objects darker than this won't bloom |
| `strength`  | `number`                 | `0.3`          | Bloom strength (0-3) - intensity of the glow effect          |
| `radius`    | `number`                 | `0`            | Bloom radius (0-1) - size of the glow spread                 |
| `children`  | `ReactNode`              |                | Effect components to render                                  |
| `onLoad`    | `() => void`             |                | Callback when canvas is initialized                          |
| `onError`   | `(error: Error) => void` |                | Error callback                                               |

#### Usage Example

```tsx
import { EffectCanvas } from '@gtelots/react-map-gl';

<EffectCanvas
  threshold={0}
  strength={0.3}
  radius={0}
  onLoad={() => console.log('Effect canvas ready')}
  onError={(error) => console.error('Canvas error:', error)}
>
  {/* Bloom effects and 3D objects */}
</EffectCanvas>;
```

## Bloom Effects

### BloomLine

Creates glowing lines with customizable geometry and materials.

#### Components

The BloomLine effect consists of three components that work together:

1. **BloomLine** - Container component
2. **BloomLineGeometry** - Defines the line path
3. **BloomLineMaterial** - Defines visual appearance

#### BloomLineGeometry Props

| Property   | Type         | Required | Description                                                       |
| ---------- | ------------ | -------- | ----------------------------------------------------------------- |
| `geometry` | `Position[]` | ✓        | Array of [longitude, latitude] coordinates defining the line path |

#### BloomLineMaterial Props

| Property    | Type                              | Default    | Description                                   |
| ----------- | --------------------------------- | ---------- | --------------------------------------------- |
| `color`     | `THREE.Color \| string \| number` | `0xffffff` | Line color (hex, color name, or Color object) |
| `linewidth` | `number`                          | `1`        | Line width in pixels                          |
| `opacity`   | `number`                          | `1`        | Line opacity (0-1)                            |
| `visible`   | `boolean`                         | `true`     | Toggle line visibility                        |

#### Usage Example

```tsx
import { BloomLine, BloomLineGeometry, BloomLineMaterial } from '@gtelots/react-map-gl';

const boundaryCoords = [
  [-74.006, 40.7128],
  [-74.007, 40.713],
  [-74.008, 40.7132],
  [-74.009, 40.7134],
];

<BloomLine>
  <BloomLineGeometry geometry={boundaryCoords} />
  <BloomLineMaterial color={0x00bfff} linewidth={4} opacity={1} />
</BloomLine>;
```

### ExtrudeWall

Creates 3D extruded walls with animated gradient materials and bloom effects.

#### Components

The ExtrudeWall effect consists of three components:

1. **ExtrudeWall** - Container component
2. **ExtrudeWallGeometry** - Defines the wall shape and height
3. **ExtrudeWallMaterial** - Defines animated material properties

#### ExtrudeWallGeometry Props

| Property   | Type         | Required | Description                                                       |
| ---------- | ------------ | -------- | ----------------------------------------------------------------- |
| `geometry` | `Position[]` | ✓        | Array of [longitude, latitude] coordinates defining the wall base |
| `height`   | `number`     | ✓        | Wall height in meters                                             |

#### ExtrudeWallMaterial Props

| Property      | Type                              | Default    | Description                |
| ------------- | --------------------------------- | ---------- | -------------------------- |
| `colorA`      | `THREE.Color \| string \| number` | `0x00bfff` | Primary gradient color     |
| `colorB`      | `THREE.Color \| string \| number` | `0x003366` | Secondary gradient color   |
| `wallOpacity` | `number`                          | `0.1`      | Wall opacity (0-1)         |
| `stripeCount` | `number`                          | `4`        | Number of animated stripes |
| `speed`       | `number`                          | `0.5`      | Animation speed multiplier |
| `visible`     | `boolean`                         | `true`     | Toggle wall visibility     |

#### Usage Example

```tsx
import { ExtrudeWall, ExtrudeWallGeometry, ExtrudeWallMaterial } from '@gtelots/react-map-gl';

const boundaryCoords = [
  [-74.006, 40.7128],
  [-74.007, 40.713],
  [-74.008, 40.7132],
  [-74.006, 40.7128],
];

<ExtrudeWall>
  <ExtrudeWallGeometry geometry={boundaryCoords} height={10} />
  <ExtrudeWallMaterial colorA={0x00bfff} colorB={0x003366} wallOpacity={0.1} speed={0.5} />
</ExtrudeWall>;
```

## Advanced Usage Patterns

### Multiple Effects in One Canvas

You can combine multiple effects within a single EffectCanvas:

```tsx
import {
  BloomLine,
  BloomLineGeometry,
  BloomLineMaterial,
  ExtrudeWall,
  ExtrudeWallGeometry,
  ExtrudeWallMaterial,
} from '@gtelots/react-map-gl';

const boundaryCoords = [
  [-74.006, 40.7128],
  [-74.007, 40.713],
  [-74.008, 40.7132],
  [-74.006, 40.7128],
];

<EffectCanvas threshold={0} strength={0.3} radius={0}>
  <BloomLine>
    <BloomLineGeometry geometry={boundaryCoords} />
    <BloomLineMaterial color={0xff6b35} linewidth={3} opacity={0.8} />
  </BloomLine>

  <ExtrudeWall>
    <ExtrudeWallGeometry geometry={boundaryCoords} height={25} />
    <ExtrudeWallMaterial colorA={0x4ecdc4} colorB={0x2c3e50} wallOpacity={0.2} speed={0.3} />
  </ExtrudeWall>
</EffectCanvas>;
```

## Next Steps

- For 3D model integration, see [React Threebox Documentation](./react-threebox.md)
- For complete examples, see [Main Documentation](./README.md)
- For advanced shader customization, explore the shader materials in the source code
