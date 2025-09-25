import type { ThreeboxPluginOptions } from '../types/lib';
import type { MapboxInstance } from '../../react-maplibre/types/lib';
import { ThreeboxInstance } from '../types/lib';
import assert from '../../../utils/assert';

export default class ThreeboxPlugin {
  private _tb: ThreeboxInstance | undefined = undefined;
  private _map: MapboxInstance | undefined = undefined;
  props: ThreeboxPluginOptions;

  constructor(props: ThreeboxPluginOptions, map?: MapboxInstance) {
    this.props = props;
    this._map = map;
    this._initialize(map);
  }

  get tb(): ThreeboxInstance | undefined {
    return this._tb;
  }

  get map(): MapboxInstance | undefined {
    return this._map;
  }

  _initialize(map?: MapboxInstance) {
    assert(map, 'Map is required to initialize Threebox');
    
    if (Object.getOwnPropertyDescriptor(map, 'version') === undefined) {
      Object.defineProperty(map, 'version', { get: function () { return "1.0"; } });
    }
    const tb = new ThreeboxInstance(map, map?.getCanvas().getContext('webgl'), this.props);
    this._tb = tb;
  }

  destroy() {
    assert(this._tb, 'Threebox is not initialized');

    this._tb?.dispose();
  }

  redraw() {
    assert(this._tb, 'Threebox is not initialized');

    this._tb?.update();
  }
}
