import * as THREE from 'three';
import type { Position } from 'geojson';
import utils from '../../../lib/bloom-effect/Utils.js';

/**
 * Custom geometry class for extruded walls
 * Extends Three.js BufferGeometry with wall-specific capabilities
 */
export class ExtrudeWallGeometry extends THREE.BufferGeometry {
  isExtrudeWallGeometry: boolean;
  type: string;
  offsetPosition: THREE.Vector3 = new THREE.Vector3();

  constructor() {
    super();
    
    this.isExtrudeWallGeometry = true;
    this.type = 'ExtrudeWallGeometry';
  }

  setGeometry(geometry: Position[], heightMeters: number): void {
    // Project coordinates to world space
    const straightProject = utils.lnglatsToWorld(geometry);
    const unitHeight = utils.projectedUnitsPerMeter(geometry[0][1]);
    const n = straightProject.length;
    const wallHeight = heightMeters * unitHeight;
    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    // Offset to reduce coordinate magnitude (reduce precision errors)
    const [offsetX, offsetY] = straightProject[0];
    this.offsetPosition.set(offsetX, offsetY, 0);

    // Create vertices for bottom and top (with offset)
    for (let i = 0; i < n; i++) {
      const [x, y] = straightProject[i];
      vertices.push(x - offsetX, y - offsetY, 0);
      uvs.push(i / (n - 1), 0);
      vertices.push(x - offsetX, y - offsetY, wallHeight);
      uvs.push(i / (n - 1), 1);
    }

    // Create indices for side faces
    for (let i = 0; i < n - 1; i++) {
      const base = i * 2;
      indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    }

    // Set attributes
    this.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    this.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    this.setIndex(indices);
    this.computeVertexNormals();
    
    // Force Three.js to recognize geometry changes
    this.computeBoundingBox();
    this.computeBoundingSphere();
  }
}
