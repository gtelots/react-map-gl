import { MixPassMaterial } from './mix-pass-material';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

/**
 * Custom ShaderPass for mixing base and bloom textures
 * Extends Three.js ShaderPass with mix-specific functionality
 */
export class MixPass extends ShaderPass {
  isMixPass: boolean;
  type: string;

  constructor(material = new MixPassMaterial()) {
    super(material);

    this.isMixPass = true;
    this.type = 'MixPass';

    this.textureID = 'baseTexture';
    this.needsSwap = true;
  }
}
