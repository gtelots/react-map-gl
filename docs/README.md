# React Map GL Documentation

A comprehensive React library for building interactive maps with 3D models, visual effects, and advanced rendering capabilities using MapLibre, Threebox, and Three.js.

## Overview

This library extends `react-map-gl` with three powerful modules:

- **React MapLibre**: Enhanced MapLibre components with custom layers
- **React Threebox**: 3D model rendering and interactive objects on maps
- **React ThreeJS**: Advanced visual effects including bloom, extrusion, and custom shaders

## Quick Start

### Installation

```bash
npm install @gtelots/react-map-gl
# or
yarn add @gtelots/react-map-gl
```

### Basic Setup

```tsx
import React from 'react';
import { Map } from 'react-map-gl/maplibre';
import {
  ThreeboxProvider,
  Threebox,
  ThreeboxLayer,
  EffectCanvas,
  BloomLine,
  BloomLineGeometry,
  BloomLineMaterial,
  ExtrudeWall,
  ExtrudeWallGeometry,
  ExtrudeWallMaterial,
} from '@gtelots/react-map-gl';

// Your map component
function MyMapApp() {
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

  const boundaryCoords = [
    [-74.006, 40.7128],
    [-74.007, 40.713],
    [-74.008, 40.7132],
    [-74.006, 40.7128],
  ];

  return (
    <MapProvider>
      <ThreeboxProvider>
        <Map
          style="mapbox://styles/mapbox/streets-v11"
          id="default"
          initialViewState={{
            longitude: -74.006,
            latitude: 40.7128,
            zoom: 14,
          }}
        >
          <Threebox defaultLights={true}>
            <ThreeboxLayer id="model-layer">
              <ModelBatcher models={models} batchSize={5} batchDelay={100} />;
            </ThreeboxLayer>

            <EffectCanvas threshold={0} strength={0.3} radius={0}>
              <BloomLine>
                <BloomLineGeometry geometry={boundaryCoords} />
                <BloomLineMaterial color={0xff6b35} linewidth={3} opacity={0.8} />
              </BloomLine>

              <ExtrudeWall>
                <ExtrudeWallGeometry geometry={boundaryCoords} height={25} />
                <ExtrudeWallMaterial
                  colorA={0x4ecdc4}
                  colorB={0x2c3e50}
                  wallOpacity={0.2}
                  speed={0.3}
                />
              </ExtrudeWall>
            </EffectCanvas>
          </Threebox>
        </Map>
      </ThreeboxProvider>
    </MapProvider>
  );
}
```

## Module Guides

### 📋 [React MapLibre](./react-maplibre.md)

Learn about custom layers, popup animations, line animations, and MapLibre integration.

### 🎯 [React Threebox](./react-threebox.md)

Discover how to add 3D models, interactive objects, and manage Threebox instances.

### ✨ [React ThreeJS](./react-threejs.md)

Explore visual effects, bloom rendering, EffectCanvas management, and advanced shader materials.

## Architecture

```
┌─────────────────────────────────────────────┐
│                 MapProvider                 │
│  ┌─────────────────────────────────────────┐│
│  │           ThreeboxProvider              ││
│  │  ┌─────────────────────────────────────┐││
│  │  │              Map                    │││
│  │  │  ┌─────────────────────────────────┐│││
│  │  │  │           Threebox              ││││
│  │  │  │  ┌─────────────┬─────────────────┤││
│  │  │  │  │ThreeboxLayer│   EffectCanvas  │││
│  │  │  │  │             │                 │││
│  │  │  │  │ 3D Models   │ Visual Effects  │││
│  │  │  │  │ - Cameras   │ - Bloom Lines   │││
│  │  │  │  │ - Buildings │ - Extruded Walls│││
│  │  │  │  │ - Objects   │ - Custom Shaders│││
│  │  │  │  └─────────────┴─────────────────┘││
│  │  │  └─────────────────────────────────────┘
│  │  └─────────────────────────────────────────┘
│  └─────────────────────────────────────────────┘
└─────────────────────────────────────────────────┘
```

## Browser Support

- **Chrome**: 90+ ✅
- **Firefox**: 88+ ✅
- **Safari**: 14+ ✅
- **Edge**: 90+ ✅
- **Mobile Safari**: 14+ ✅
- **Chrome Mobile**: 90+ ✅

### Requirements

- WebGL 2.0 support
- ES2018+ JavaScript features
- GPU with sufficient memory for 3D rendering

## Contributing

We welcome contributions! Please see our contributing guidelines and code of conduct.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-repo/react-map-gl.git

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build library
npm run build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- 📚 [Documentation](./README.md)
- 🐛 [Issue Tracker](https://github.com/your-repo/react-map-gl/issues)
- 💬 [Discussions](https://github.com/your-repo/react-map-gl/discussions)
- 📧 [Email Support](mailto:support@your-domain.com)

---

**Ready to build amazing interactive maps?** Start with the [Quick Start](#quick-start) guide above!
