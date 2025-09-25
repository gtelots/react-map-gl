type ModelTypes = 'obj' | 'mtl' | 'gltf' | 'glb' | 'fbx' | 'dae';

type ModelUnits = 'meters' | 'scene';

type ModelAnchors =
  | 'auto'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'center'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

type Vector3 = {
  x: number;
  y: number;
  z: number;
};

type ModelLoaderOptions = {
  /** Unique identifier for the model loader instance */
  id?: string;
  /** Type is required
   * @default '.glb'
   */
  type: ModelTypes;
  /** URL path to asset's .obj, .mtl, .glb, .gltf, .fbx, .dae file. */
  obj: string;
  /** URL path to assets .mtl files needed for OBJ models respectively
   * @deprecated Use `obj` with .glb extension instead
   */
  mtl?: string;
  /** URL path to assets .bin files needed for GLTF models respectively
   * @deprecated Use `obj` with .glb extension instead
   */
  bin?: string;
  /** "meters" is recommended for precision. Units with which to interpret the object's vertices.
   * If meters, Threebox will also rescale the object with changes in latitude,
   * to appear to scale with objects and geography nearby.
   * @default 'meters'
   */
  units?: ModelUnits;
  /** Rotation of the object along the three axes, to align it to desired orientation before future rotations.
   * Note that future rotations apply atop this transformation, and do not overwrite it.
   * rotate attribute must be provided in number or per axis
   * (i.e. for an object rotated 90 degrees over the x axis rotation: {x: 90, y: 0, z: 0})
   * @default { x: 90, y: 180, z: 0 }
   */
  rotation?: number | Vector3;
  /** Scale of the object along the three axes, to size it appropriately before future transformations.
   * Note that future scaling applies atop this transformation, rather than overwriting it.
   * scale attribute must be provided in number or per axis
   * (i.e. for an object transformed to 3 times higher than it's default size scale: {x: 1, y: 1, z: 3})
   * @default 1
   */
  scale?: number | Vector3;
  /** This param will position the pivotal center of the 3D models to the coords it's positioned.
   * This could have the following values top, bottom, left, right, center, top-left, top-right, bottom-left, bottom-right.
   * Default value is auto. auto value will do nothing, so the model will use the anchor defined in the model, whatever it is.
   * @default 'auto'
   */
  anchor?: ModelAnchors;
  /** 3D models are often not centered in their axes so the object positions and rotates wrongly.
   * adjustment param must be provided in units per axis (i.e. adjustment: {x: 0.5, y: 0.5, z: 0}),
   * so the model will correct the center position of the object
   * @default 1
   * @deprecated Don't use adjustment, use setCoords to move the object instead
   */
  adjustment?: number | Vector3;
  /** This param allows to normalize specular values from some 3D models
   * @default true
   * @deprecated Don't use normalize, materials should be fixed in the 3D model instead
   */
  normalize?: boolean;
  /** GeoJson feature instance. properties object of the GeoJson standard feature could be used to store relavant data
   * to load and paint many different objects such as camera position, zoom, pitch or bearing,
   * apart from the attributes already usually used by Mapbox GL examples such as height, base_height, color
   */
  feature?: GeoJSON.Feature;
  /** This param allows to have or not a tooltip
   * @default false
   * @deprecated Don't use tooltip, by default is set with the value of tb.enableTooltips
   */
  tooltip?: boolean;
  /** This param allows to have or not a bounding box
   * @default false
   * @deprecated Don't use bbox, by default is set with the value of tb.enableSelectingObjects
   */
  bbox?: boolean;
  /** This param allows to hide an object from raycast individually
   * @default true
   * @deprecated Use visibility property in ModelRenderer instead
   */
  raycasted?: boolean;
  /** This param allows to load an object without cloning it by default, but it will reduce performance
   * because the new object will consume extra memory as no textures will be cloned.
   * Some objects could require full new instances when animations and textures don't work well with cloning,
   * then clone: false will solve the problem. By default clone param is true.
   * @default true
   * @deprecated Don't use clone, by default is set with the value of tb.cache
   */
  clone?: boolean;
  /** This allows to assign by param a default animation. Igneored if the object does not contain animations
   * @default 0
   * @deprecated Use animationOptions in ModelRenderer instead
   */
  defaultAnimation?: number;
};

type ModelRendererOptions = {
  /** Unique identifier for the model renderer instance */
  id?: string;
  /** Layer ID to which to add the model */
  layerId?: string;
  /** Position to which to move the object */
  coords?: [number, number, number] | [number, number];
  /** Rotation(s) to set the object, in units of degrees */
  rotation?: number | Vector3;
  /** Scale(s) to set the object, where 1 is the default scale */
  scale?: number | Vector3;
  /** Plays one of the embedded animations of a loaded 3D model.
   * The animation index must be set in the attribute options.animation
   */
  animationOptions?: {
    /** Index of the animation in the 3D model.
     * If you need to check whats the index of the animation you can get the full array using obj.animations.
     */
    animation?: number;
    /** Duration of the animation, in milliseconds
     * @default 1000
     */
    duration?: number;
    /** This value changes the obj.mixer.timeScale of the animation being played where 1 is the default duration of the animation,
     * < 1 will mathe the animation slower and > 1 will make the animation faster
     * @default 1
     */
    speed?: number;
  };
  pathOptions?: {
    /** Path for the object to follow */
    path?: Array<[number, number, number]> | Array<[number, number]>;
    /** Duration to travel the path, in milliseconds
     * @default 1000
     */
    duration?: number;
    /** Rotate the object so that it stays aligned with the direction of travel, throughout the animation
     * @default true
     */
    trackHeading?: boolean;
  };
  /** This get/set property receives and returns a boolean value to convert an THREE.Object3D in wireframes or texture it. */
  wireframe?: boolean;
  /** This get/set property receives and returns a boolean value to override the property visible of a THREE.Object3D,
   * adding also the same visibility value for obj.label and obj.tooltip
   * This property is overriden by obj.hidden, so if obj.hidden is false, obj.visibility is ignored.
   * By Threebox design .boundingBoxShadow is hidden for THREE.Raycaster even when it's visible for the camera.
   */
  visibility?: boolean;
  /** This get/set property receives and returns the value of the hidden status of an object.
   * This property overrides the value of obj.visibility.
   */
  hidden?: boolean;
  /**
   * Effect to apply when rendering the model (e.g., fade-in effect).
   */
  renderingEffect?: {
    /**
     * Duration of the render effect, in milliseconds
     * @default 250
     */
    duration?: number;
    /**
     * Easing function to use for the render effect
     * @default (t) => t
     */
    easing?: (t: number) => number;
  };
  /**
   * Callback function called when the selection changes.
   * @param e Event object containing details about the selection change.
   * @returns
   */
  onSelectedChange?: (e: any) => void;
  /**
   * Callback function called when the wireframe mode changes.
   * @param e Event object containing details about the wireframe change.
   * @returns
   */
  onWireframed?: (e: any) => void;
  /**
   * Callback function called when the playing state of an animation changes.
   * @param e Event object containing details about the playing state change.
   * @returns
   */
  onIsPlayingChanged?: (e: any) => void;
  /**
   * Callback function called when the object is dragged.
   * @param e Event object containing details about the drag event.
   * @returns
   */
  onDraggedObject?: (e: any) => void;
  /**
   * Callback function called when the mouse is over the object.
   * @param e Event object containing details about the mouse over event.
   * @returns
   */
  onObjectMouseOver?: (e: any) => void;
  /**
   * Callback function called when the mouse is no longer over the object.
   * @param e Event object containing details about the mouse out event.
   * @returns
   */
  onObjectMouseOut?: (e: any) => void;
  /**
   * Callback function called when the object finishes following a path.
   * @param e Event object containing details about the path finish event.
   * @returns
   */
  onFollowPathFinish?: (e: any) => void;
};

export type ModelBatchItem = {
  /** ModelLoader props */
  loader: Partial<ModelLoaderOptions>;
  /** Array of ModelRenderer props - one loader can render multiple instances */
  renderers: ModelRendererOptions[];
};

export type { ModelTypes, ModelUnits, ModelAnchors, ModelLoaderOptions, ModelRendererOptions };
