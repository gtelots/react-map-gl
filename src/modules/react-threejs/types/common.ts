import * as THREE from 'three';
import type { Position } from 'geojson';
import type { LineMaterialParameters } from 'three/examples/jsm/Addons.js';
import type { BloomRenderer } from '../threejs/graphics/bloom-renderer';
import type { CanvasContainer } from '../threejs/graphics/canvas-container';

/**
 * Context value for the Canvas context
 */
export type EffectCanvasContext = {
  /** Three.js scene */
  scene: THREE.Scene;
  /** Three.js camera */
  camera: THREE.PerspectiveCamera;
  /** Three.js renderer */
  renderer: THREE.WebGLRenderer;
  /** Object group container */
  group: THREE.Group;
  /** Ambient light */
  light: THREE.AmbientLight;
};

export type EffectManagerContext = EffectCanvasContext & {
  /** Bloom renderer instance */
  bloom: BloomRenderer;
  /** Canvas container instance */
  container: CanvasContainer;
};

/**
 * Bloom effect parameters configuration
 */
export type EffectCanvasParams = {
  /** Threshold for bloom effect (0-1) */
  threshold?: number;
  /** Strength of bloom effect (0-3) */
  strength?: number;
  /** Radius of bloom effect (0-1) */
  radius?: number;
};

/**
 * Parameters for initializing MixPass material
 */
export type MixPassMaterialParams = THREE.ShaderMaterialParameters & {
  /** Bloom texture for blending */
  bloomTexture?: THREE.Texture | null;
};

/**
 * Parameters for initializing bloom line geometry
 */
export type BloomLineGeometryParams = {
  /** Geometry data for the bloom effect */
  geometry?: Position[];
};

/**
 * Line configuration for bloom effect
 */
export type BloomLineMaterialParams = LineMaterialParameters & {
  /** Line color (hex value) */
  color?: THREE.Color | string | number;
  /** Line width in pixels */
  linewidth?: number;
  /** Line opacity (0-1) */
  opacity?: number;
};

/**
 * Parameters for initializing extruded wall geometry
 */
export type ExtrudeWallGeometryParams = {
  /** Geometry data for the extruded wall */
  geometry?: Position[];
  /** Wall height in meters */
  height?: number;
};

/**
 * Wall configuration for bloom effect
 */
export type ExtrudeWallMaterialParams = THREE.ShaderMaterialParameters & {
  /** Primary color for gradient */
  colorA?: THREE.Color | string | number;
  /** Secondary color for gradient */
  colorB?: THREE.Color | string | number;
  /** Wall opacity (0-1) */
  wallOpacity?: number;
  /** Number of animated stripes */
  stripeCount?: number;
  /** Animation speed multiplier */
  speed?: number;
};
