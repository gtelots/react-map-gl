import * as THREE from 'three';
import { ExtrudeWallGeometry } from './extrude-wall-geometry';
import { ExtrudeWallMaterial } from './extrude-wall-material';

/**
 * Custom mesh class for extruded walls
 * Extends Three.js Mesh with wall-specific functionality
 */
export class ExtrudeWall extends THREE.Mesh {
  isExtrudeWall: boolean;
  type: string;

  constructor(
    geometry = new ExtrudeWallGeometry(),
    material = new ExtrudeWallMaterial({ colorA: 0x00bfff, colorB: 0x003366 }),
  ) {
    super(geometry, material);
    
    this.isExtrudeWall = true;
    this.type = 'ExtrudeWall';
    this.userData.isStripeWall = true;
  }

  setPosition(position: THREE.Vector3): void {
    this.position.copy(position);
  }
}
