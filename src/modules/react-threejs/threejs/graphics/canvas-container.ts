import type { MapboxInstance } from '../../../react-maplibre/types/lib.js';

export class CanvasContainer extends HTMLCanvasElement {
  constructor(map: MapboxInstance) {
    // Get existing container or create new one
    const mapContainer = map.getContainer();
    const selectorId = '_THREE_CANVAS_CONTAINER_';
    let existingContainer = mapContainer.querySelector(`#${selectorId}`) as HTMLCanvasElement;

    if (existingContainer) {
      return existingContainer as any;
    }

    // Create new container
    super();

    this.id = selectorId;
    this.style.position = 'absolute';
    this.style.zIndex = '99999';
    this.style.pointerEvents = 'none';
    this.style.width = '100%';
    this.style.height = '100%';

    const mapCanvas = map.getCanvas();
    this.width = mapCanvas.clientWidth;
    this.height = mapCanvas.clientHeight;

    mapContainer.appendChild(this);
  }

  dispose(): void {
    this.remove();
  }
}

// Define custom element
window.customElements.define('canvas-container', CanvasContainer, { extends: 'canvas' });
