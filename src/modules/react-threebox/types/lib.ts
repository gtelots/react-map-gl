import { Threebox } from 'threebox-plugin';

type ThreeboxPluginOptions = {
  /** Whether to add some default lighting to the scene. If no lighting added, most objects in the scene will render as black
   * @default false
   */
  defaultLights?: boolean;
  /** It sets lights that simulate Sun position for the map center coords map.getCenter and user local datetime new Date(). This sunlight can be updated through tb.setSunlight method. It calls internally to suncalc module.
   * @default false
   * @deprecated Internal use only. Do not set this property.
   */
  realSunlight?: boolean;
  /** It sets if a light helper will be shown when realSunlight is true.
   * @default false
   * @deprecated Internal use only. Do not set this property.
   */
  realSunlightHelper?: boolean;
  /** Color of line. Unlike other Threebox objects, this color will render on screen precisely as specified, regardless of scene lighting
   * @default true
   */
  passiveRendering?: boolean;
  /** Enables the Mouseover and Selection of fill-extrusion features. This will fire the event SelectedFeatureChange
   * @default false
   */
  enableSelectingFeatures?: boolean;
  /** Enables the Mouseover and Selection of 3D objects. This will fire the event SelectedChange. This value will set the options.bbx value of the objects created.
   * @default false
   */
  enableSelectingObjects?: boolean;
  /** Enables to the option to Drag a 3D object. This will fire the event ObjectDragged where draggedAction = 'translate' or draggedAction = 'altitude'
   * @default false
   */
  enableDraggingObjects?: boolean;
  /** Enables to the option to Drag a 3D object. This will fire the event ObjectDragged where draggedAction = 'rotate'
   * @default false
   */
  enableRotatingObjects?: boolean;
  /** Enables the default tooltips on fill-extrusion features and 3D Objects
   * @default false
   */
  enableTooltips?: boolean;
  /** Enables the default help tooltips when an object is being moved, rotated or measured.
   * @default false
   */
  enableHelpTooltips?: boolean;
  /** Enables the option for multi layer pages where a default layer will be created internally that will manage the tb.update calls
   * @default false
   */
  multiLayer?: boolean;
  /** Enables the option to set a THREE.OrthographicCamera instead of a THREE.PerspectiveCamera which is the default in Mapbox
   * @default false
   */
  orthographic?: boolean;
  /** Enables to set the FOV of the default THREE.PerspectiveCamera. This value has no effect if orthographic: true
   * @default ThreeboxConstants.FOV_DEGREES
   */
  fov?: number;
  /** It sets a built-in atmospheric layer initially set with the time and the map center position. This layer is automatically updated if realSunlight is also true, but it can be updated separately through tb.updateSunSky(tb.getSunSky()) method call.
   * @deprecated Internal use only. Do not set this property.
   */
  sky?: boolean;
  /** It sets a built-in terrain layer initially set with the time and the map center position. This layer is automatically updated if realSunlight is also true, but it can be updated separately through tb.updateSunSky(tb.getSunSky()) method call.
   * @deprecated Internal use only. Do not set this property.
   */
  terrain?: boolean;
  /** Caching options for 3D models loaded. Caching is done using Cache Storage. */
  cache?: {
    /** Name of the cache storage where models will be stored.
     * @default 'threebox-cache'
     */
    cacheName?: string;
    /** Maximum age of a cached model in milliseconds. Default is 7 days.
     * @default 7 * 24 * 60 * 60 * 1000
     */
    maxAge?: number;
    /** Maximum number of entries in the cache. Default is 100.
     * @default 100
     */
    maxCacheEntries?: number;
  };
};

export { Threebox as ThreeboxInstance };
export type { ThreeboxPluginOptions };
