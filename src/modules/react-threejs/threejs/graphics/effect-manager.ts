import * as THREE from 'three';
import type { EffectCanvasContext, EffectCanvasParams, EffectManagerContext } from '../../types/common.js';
import type { MapboxInstance } from '../../../react-maplibre/types/lib.js';
import { CanvasContainer } from './canvas-container.js';
import { WebGLShaderManager } from './webgl-shader-manager.js';
import { CanvasManager } from './canvas-manager.js';
import { BloomRenderer } from './bloom-renderer.js';

export class EffectManager {
  private _canvasContext: EffectCanvasContext | null = null;
  private _canvasContainer: CanvasContainer | null = null;
  private _canvasManager: CanvasManager | null = null;
  private _bloomRenderer: BloomRenderer | null = null;
  private _shaderManager: WebGLShaderManager | null = null;
  private _map: MapboxInstance | null = null;
  private _mapResizing: (() => void) | null = null;
  props: EffectCanvasParams;

  get context(): EffectManagerContext | null {
    if (!this._canvasContext || !this._bloomRenderer || !this._canvasContainer) {
      return null;
    }
    return {
      scene: this._canvasContext.scene,
      camera: this._canvasContext.camera,
      renderer: this._canvasContext.renderer,
      group: this._canvasContext.group,
      light: this._canvasContext.light,
      bloom: this._bloomRenderer,
      container: this._canvasContainer,
    };
  }

  constructor(props: EffectCanvasParams, map?: MapboxInstance) {
    this.props = props;
    if (map) {
      this._map = map;
      this.initialize(map);
    }
  }

  initialize(map: MapboxInstance) {
    map.addLayer({
      id: 'effect-layer',
      type: 'custom',
      renderingMode: '3d',
      onAdd: this._onAdd.bind(this),
      render: this._render.bind(this),
      onRemove: this._onRemove.bind(this),
    });
  }

  destroy() {
    this._onRemove();

    if (this._map) {
      this._map.removeLayer('effect-layer');
      this._map = null;
    }
  }

  private _onAdd(map: MapboxInstance, gl: WebGLRenderingContext) {
    const container = map.getCanvas();
    const { clientWidth, clientHeight } = container;

    // Create and append effect container
    this._canvasContainer = new CanvasContainer(map);

    // Initialize effect canvas
    this._canvasManager = new CanvasManager(map, this._canvasContainer);
    const { scene, camera, renderer, group, light } = this._canvasManager;

    // Initialize bloom renderer
    this._bloomRenderer = new BloomRenderer(renderer, scene, camera);
    this._bloomRenderer.setResolution(clientWidth, clientHeight);
    this._bloomRenderer.setValues(this.props);

    // Initialize WebGL shader manager
    this._shaderManager = new WebGLShaderManager(gl);

    // Store context
    this._canvasContext = { scene, camera, renderer, group, light };
    this._setMapResizing();
  }

  private _render() {
    // if (this._map && this._map.repaint) {
    //   this._map.repaint = false;
    // }

    if (this._canvasManager) {
      this._canvasManager.render();
    }

    if (this._bloomRenderer) {
      this._bloomRenderer.render();
    }

    if (this._shaderManager && this._canvasContainer) {
      const { width, height } = this._canvasContainer;
      this._shaderManager.render(this._canvasContainer, width, height);
    }
    
    // if (this._map && !this._map.repaint) {
    //   this._map.triggerRepaint();
    // }
  }

  private _onRemove(): void {
    if (this._mapResizing) {
      this._removeMapResizing();
    }

    if (this._canvasContainer) {
      this._canvasContainer.remove();
      this._canvasContainer = null;
    }

    if (this._canvasManager) {
      this._canvasManager.dispose();
      this._canvasManager = null;
    }

    if (this._bloomRenderer) {
      this._bloomRenderer.dispose();
      this._bloomRenderer = null;
    }

    if (this._shaderManager) {
      this._shaderManager?.dispose();
      this._shaderManager = null;
    }
  }

  private _handleMapResizing(): void {
    if (!this._map) return;

    const mapCanvas = this._map.getCanvas();
    const width = mapCanvas.width / window.devicePixelRatio;
    const height = mapCanvas.height / window.devicePixelRatio;

    if (this._canvasContainer) {
      this._canvasContainer.width = width;
      this._canvasContainer.height = height;
      this._canvasContainer.style.width = width + 'px';
      this._canvasContainer.style.height = height + 'px';
    }

    this._canvasManager?.resize(width, height);
    this._bloomRenderer?.resize(width, height);
  }

  private _setMapResizing(): void {
    const boundResizing = this._handleMapResizing.bind(this);

    window.addEventListener('resize', boundResizing);
    this._map?.on('resize', boundResizing);
    this._mapResizing = boundResizing;
  }

  private _removeMapResizing(): void {
    window.removeEventListener('resize', this._mapResizing!);
    this._map?.off('resize', this._mapResizing!);
    this._mapResizing = null;
  }
}
