import * as THREE from 'three';
import type { Position } from 'geojson';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import utils from '../../../lib/bloom-effect/Utils.js';

/**
 * Custom geometry class for bloom lines
 * Extends Three.js LineGeometry with preprocessing capabilities
 */
export class BloomLineGeometry extends LineGeometry {
  isBloomLineGeometry: boolean;
  type: string;
  processedVertices: THREE.Vector3[] = [];
  normalizedPosition: THREE.Vector3 = new THREE.Vector3();

  constructor() {
    super();
    
    this.isBloomLineGeometry = true;
    this.type = 'BloomLineGeometry';
  }

  setGeometry(geometry: Position[]): void {
    const straightProject = utils.lnglatsToWorld(geometry);
    const normalized = utils.normalizeVertices(straightProject);
    const flattenedArray = utils.flattenVectors(normalized.vertices);

    this.processedVertices = normalized.vertices;
    this.normalizedPosition = normalized.position;
    this.setPositions(flattenedArray);
  }
}
