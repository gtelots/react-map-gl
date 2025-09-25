import * as THREE from 'three';
import type { MixPassMaterialParams } from '../../../types/common';
import { ShaderLib } from '../../../threejs/shaders/shader-lib';

/**
 * Custom shader material for mixing base and mix textures
 * Extends Three.js ShaderMaterial with mix-specific functionality
 */
export class MixPassMaterial extends THREE.ShaderMaterial {
  isMixPassMaterial: boolean;
  type: string;

  constructor(parameters: MixPassMaterialParams = {}) {
    super({
      uniforms: THREE.UniformsUtils.clone(ShaderLib['mixPass'].uniforms),
      vertexShader: ShaderLib['mixPass'].vertexShader,
      fragmentShader: ShaderLib['mixPass'].fragmentShader,
      defines: {},
    });

    this.isMixPassMaterial = true;
    this.type = 'MixPassMaterial';
    this.setValues(parameters);
  }

  get baseTexture(): THREE.Texture {
    return this.uniforms.baseTexture.value;
  }

  set baseTexture(value: THREE.Texture) {
    this.uniforms.baseTexture.value = value;
  }

  get bloomTexture(): THREE.Texture {
    return this.uniforms.bloomTexture.value;
  }

  set bloomTexture(value: THREE.Texture) {
    this.uniforms.bloomTexture.value = value;
  }
}
