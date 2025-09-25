import * as THREE from 'three';
import type { MapboxInstance } from '../../../react-maplibre/types/lib.js';
import CameraSync from '../../lib/bloom-effect/CameraSync.js';

export class CanvasManager {
  public _scene: THREE.Scene;
  public _camera: THREE.PerspectiveCamera;
  public _renderer: THREE.WebGLRenderer;
  public _group: THREE.Group;
  public _light: THREE.AmbientLight;

  get scene(): THREE.Scene {
    return this._scene;
  }

  get camera(): THREE.PerspectiveCamera {
    return this._camera;
  }

  get renderer(): THREE.WebGLRenderer {
    return this._renderer;
  }

  get group(): THREE.Group {
    return this._group;
  }

  get light(): THREE.AmbientLight {
    return this._light;
  }

  constructor(map: MapboxInstance, container: HTMLCanvasElement) {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (Object.getOwnPropertyDescriptor(map, 'version') === undefined) {
      Object.defineProperty(map, 'version', { get: function () { return "1.0"; } });
    }

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: container,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.autoClear = false;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.setClearAlpha(0.0);

    // Initialize camera and scene
    const camera = new THREE.PerspectiveCamera(map.transform.fov, w / h, 0.1, 1e21);
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    const light = new THREE.AmbientLight(0xcccccc);

    scene.add(group);
    scene.add(light);

    // Camera sync
    new CameraSync(map, camera, group);

    this._scene = scene;
    this._camera = camera;
    this._renderer = renderer;
    this._group = group;
    this._light = light;
  }

  render(): void {
    if (!this._scene || !this._camera || !this._renderer || !this._group) return;

    const now = performance.now() * 0.001;

    // Update animated materials
    this._updateAnimatedMaterials(now);

    // Reset Three.js renderer state before WebGL operations
    this._renderer.resetState();

    // Render Three.js scene to ensure depth buffer is populated (if needed)
    this._renderer.render(this._scene, this._camera);
  }

  resize(width: number, height: number): void {
    if (!this._camera || !this._renderer) return;

    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(width, height);
  }

  dispose(): void {
    if (this._group) {
      this._group.clear();
    }

    if (this._scene) {
      this._scene.clear();
    }

    if (this._camera) {
      this._camera.clear();
    }

    if (this._renderer) {
      this._renderer.dispose();
    }
  }

  private _updateAnimatedMaterials(time: number): void {
    if (!this._group) return;

    this._group.traverse((obj: any) => {
      if (obj.material && obj.material.time !== undefined) {
        obj.material.time = time;
      }
    });
  }
}
