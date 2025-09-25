import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { BloomLineGeometry } from './bloom-line-geometry';
import { BloomLineMaterial } from './bloom-line-material';

/**
 * Custom mesh class for bloom lines
 * Extends Three.js Line2 with bloom-specific functionality
 */
export class BloomLine extends Line2 {
  isBloomLine: boolean;
  type: string;

  constructor(
    geometry = new BloomLineGeometry(),
    material = new BloomLineMaterial({ color: 'white' }),
  ) {
    super(geometry, material);
    
    this.isBloomLine = true;
    this.type = 'BloomLine';
  }

  setPosition(position: THREE.Vector3): void {
    this.position.copy(position);
  }
}
