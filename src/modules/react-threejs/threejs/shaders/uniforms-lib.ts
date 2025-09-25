import * as THREE from 'three';

/**
 * Uniforms library for the shaders
 */
export const UniformsLib = {
  mixPass: {
    baseTexture: { value: null },
    bloomTexture: { value: null },
  },
  extrudeWall: {
    colorA: { value: new THREE.Color(0x00bfff) },
    colorB: { value: new THREE.Color(0x003366) },
    wallOpacity: { value: 0.1 },
    stripeCount: { value: 2 },
    speed: { value: 0.5 },
    time: { value: 0 }, // Time uniform for animation (start at 0)
  },
};
