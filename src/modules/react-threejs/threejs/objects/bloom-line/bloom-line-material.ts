import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import type { BloomLineMaterialParams } from '../../../types/common.js';

/**
 * Custom material class for bloom lines
 * Extends Three.js LineMaterial with bloom-specific configurations
 */
export class BloomLineMaterial extends LineMaterial {
  isBloomLineMaterial: boolean;
  type: string;

  constructor(parameters: BloomLineMaterialParams = {}) {
    super({
      color: parameters.color || 'white',
      linewidth: parameters.linewidth ?? 1,
      opacity: parameters.opacity ?? 1,
      dashed: false,
      transparent: true,
      depthWrite: false,
    });

    this.isBloomLineMaterial = true;
    this.type = 'BloomLineMaterial';
    this.setValues(parameters);
  }
}
