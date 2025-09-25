import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { UnrealBloomPass } from '../../lib/bloom-effect/postprocessing/UnrealBloomPass.js';
import { MixPass, MixPassMaterial } from '../objects/mix-pass/index.js';
import type { EffectCanvasParams } from '../../types/common.js';

export class BloomRenderer {
  private _composer: EffectComposer;
  private _bloomComposer: EffectComposer;
  private _bloomPass: UnrealBloomPass;
  private _bloomLayer: THREE.Layers;
  private _darkMaterial: THREE.MeshBasicMaterial;
  private _materials: Record<string, THREE.Material | THREE.Material[]> = {};
  private readonly bloomScene = 1; // Layer for bloom effect

  constructor(
    private _renderer: THREE.WebGLRenderer,
    private _scene: THREE.Scene,
    private _camera: THREE.PerspectiveCamera,
  ) {
    this._bloomLayer = new THREE.Layers();
    this._bloomLayer.set(this.bloomScene);
    this._darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });

    const renderScene = new RenderPass(this._scene, this._camera);

    const bloomPass = new UnrealBloomPass();
    bloomPass.resolution = new THREE.Vector2();
    bloomPass.strength = 0;
    bloomPass.radius = 0;
    bloomPass.threshold = 0;

    const bloomComposer = new EffectComposer(this._renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    const mixPassMaterial = new MixPassMaterial();
    mixPassMaterial.bloomTexture = bloomComposer.renderTarget2.texture;
    const mixPass = new MixPass(mixPassMaterial);

    const outputPass = new OutputPass();
    const composer = new EffectComposer(this._renderer);
    composer.addPass(renderScene);
    composer.addPass(mixPass);
    composer.addPass(outputPass);

    this._composer = composer;
    this._bloomComposer = bloomComposer;
    this._bloomPass = bloomPass;
  }

  setResolution(width: number, height: number): void {
    if (this._bloomPass) {
      this._bloomPass.resolution = new THREE.Vector2(width, height);
    }
  }

  setValues(effect: Partial<EffectCanvasParams>): void {
    if (this._bloomPass && effect) {
      this._bloomPass.strength = effect.strength || 0;
      this._bloomPass.radius = effect.radius || 0;
      this._bloomPass.threshold = effect.threshold || 0;
    }
  }

  render(): void {
    if (!this._bloomComposer || !this._composer) return;
    this._scene.traverse(this._darkenNonBloomed.bind(this));
    this._scene.traverse(this._restoreMaterial.bind(this));
    
    this._bloomComposer.render();
    this._composer.render();
  }

  resize(width: number, height: number): void {
    if (!this._bloomComposer || !this._composer) return;

    this._composer.setSize(width, height);
    this._bloomComposer.setSize(width, height);
  }

  enableBloom(object: THREE.Object3D): void {
    object.layers.enable(this.bloomScene);
  }

  disableBloom(object: THREE.Object3D): void {
    object.layers.disable(this.bloomScene);
  }

  dispose(): void {
    if (this._bloomComposer) {
      this._bloomComposer.dispose();
    }

    if (this._composer) {
      this._composer.dispose();
    }

    this._materials = {};
  }

  private _darkenNonBloomed(obj: THREE.Object3D): void {
    const mesh = obj as THREE.Mesh;
    if (mesh.isMesh && !this._bloomLayer?.test(obj.layers) && this._darkMaterial) {
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map(() => this._darkMaterial!)
        : this._darkMaterial;
      this._materials[obj.uuid] = mesh.material;
    }
  }

  private _restoreMaterial(obj: THREE.Object3D): void {
    const mesh = obj as THREE.Mesh;
    if (this._materials[obj.uuid]) {
      mesh.material = this._materials[obj.uuid];
      delete this._materials[obj.uuid];
    }
  }
}
