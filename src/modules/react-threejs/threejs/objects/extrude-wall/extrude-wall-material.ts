import * as THREE from 'three';
import type { ExtrudeWallMaterialParams } from '../../../types/common.js';
import { ShaderLib } from '../../shaders/shader-lib.js';

/**
 * Custom material class for extruded walls
 * Extends Three.js ShaderMaterial with animated stripe effects
 */
export class ExtrudeWallMaterial extends THREE.ShaderMaterial {
  isExtrudeWallMaterial: boolean;
  type: string;

  constructor(parameters: ExtrudeWallMaterialParams = {}) {
    super({
      uniforms: THREE.UniformsUtils.clone(ShaderLib['extrudeWall'].uniforms),
      vertexShader: ShaderLib['extrudeWall'].vertexShader,
      fragmentShader: ShaderLib['extrudeWall'].fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    this.isExtrudeWallMaterial = true;
    this.type = 'ExtrudeWallMaterial';
    this.setValues(parameters);
  }

  get colorA(): THREE.Color {
    return this.uniforms.colorA.value;
  }

  set colorA(value: THREE.Color) {
    this.uniforms.colorA.value = value;
  }

  get colorB(): THREE.Color {
    return this.uniforms.colorB.value;
  }

  set colorB(value: THREE.Color) {
    this.uniforms.colorB.value = value;
  }

  get stripeCount(): number {
    return this.uniforms.stripeCount.value;
  }

  set stripeCount(value: number) {
    this.uniforms.stripeCount.value = value;
  }

  get wallOpacity(): number {
    return this.uniforms.wallOpacity.value;
  }

  set wallOpacity(value: number) {
    this.uniforms.wallOpacity.value = value;
  }

  get speed(): number {
    return this.uniforms.speed.value;
  }

  set speed(value: number) {
    this.uniforms.speed.value = value;
  }

  get time(): number {
    return this.uniforms.time.value;
  }

  set time(value: number) {
    this.uniforms.time.value = value;
  }
}
