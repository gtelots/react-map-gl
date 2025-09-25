import * as THREE from 'three';
import { UniformsLib } from './uniforms-lib';
import { ShaderChunk } from './shader-chunk';

/**
 * Shader library for the shaders
 */
export const ShaderLib: { [key: string]: THREE.ShaderLibShader } = {
  mixPass: {
    uniforms: UniformsLib.mixPass,
    vertexShader: ShaderChunk.mixPass_vert,
    fragmentShader: ShaderChunk.mixPass_frag,
  },
  extrudeWall: {
    uniforms: UniformsLib.extrudeWall,
    vertexShader: ShaderChunk.extrudeWall_vert,
    fragmentShader: ShaderChunk.extrudeWall_frag,
  },
};
