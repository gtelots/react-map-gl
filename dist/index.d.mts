import { PopupEvent } from 'react-map-gl/maplibre';
export * from 'react-map-gl/maplibre';
import * as React$1 from 'react';
import React__default from 'react';
import * as maplibre_gl from 'maplibre-gl';
import { CustomLayerInterface, Popup, Map, PopupOptions, FilterSpecification } from 'maplibre-gl';
export { CustomLayerInterface as CustomLayerOptions, CustomRenderMethodInput as CustomRenderOptions, Map as MapboxInstance } from 'maplibre-gl';
import * as react_map_gl_dist_esm_exports_maplibre from 'react-map-gl/dist/esm/exports-maplibre';
import { Position, Feature as Feature$1, Point } from 'geojson';
import { Threebox as Threebox$1 } from 'threebox-plugin';
export { Threebox as ThreeboxInstance } from 'threebox-plugin';
import * as THREE from 'three';
import { LineMaterialParameters } from 'three/examples/jsm/Addons.js';

type CustomLayerProps = Omit<CustomLayerInterface, 'type' | 'renderingMode'> & {
    beforeId?: string;
    children?: React$1.ReactNode;
    onMount?: () => void;
    onUnmount?: () => void;
};
declare const CustomLayer: React$1.FC<CustomLayerProps>;

/**
 * An animated popup component.
 *
 * @param {Object} [options]
 * @param {Object} [options.openingAnimation] - Options controlling the opening
 *   animation.
 * @param {Object} [options.openingAnimation.duration=1000] - The animation's duration,
 *   measured in milliseconds.
 * @param {Object} [options.openingAnimation.easing] - The easing function name of
 *   the animation. See https://easings.net
 * @param {Object} [options.closingAnimation='easeOutElastic'] - Options controlling
 *   the closing animation.
 * @param {Object} [options.closingAnimation.duration=300] - The animation's duration,
 *   measured in milliseconds.
 * @param {Object} [options.closingAnimation.easing='easeInBack'] - The easing function
 *   name of the animation. See https://easings.net
 */
declare class AnimatedPopup extends Popup {
    constructor(options: any);
    _animated: boolean;
    _contentWrapper: HTMLDivElement | null;
    setDOMContent(htmlNode: any): this;
    addTo(map: any): this;
    _runOpenAnimation(): void;
    _cancelAnimation: (() => void) | undefined;
    remove(): this;
}

declare const PopupAnimation: React$1.NamedExoticComponent<maplibre_gl.PopupOptions & {
    longitude: number;
    latitude: number;
    style?: React$1.CSSProperties;
    onOpen?: (e: react_map_gl_dist_esm_exports_maplibre.PopupEvent) => void;
    onClose?: (e: react_map_gl_dist_esm_exports_maplibre.PopupEvent) => void;
    children?: React$1.ReactNode;
} & React$1.RefAttributes<AnimatedPopup>>;

type LineAnimationProps = {
    map: Map;
    layerId: string;
    speed?: number;
};
/**
 * Hook to animate dash array for line.
 * @param map Mapbox map instance
 * @param layerId Layer id to animate
 */
declare const useLineAnimation: ({ map, layerId, speed }: LineAnimationProps) => {};

/**
 * Props for the Popup component.
 */
type PopupAnimationProps = PopupOptions & {
    /** Longitude coordinate for the popup position (required). */
    longitude: number;
    /** Latitude coordinate for the popup position (required). */
    latitude: number;
    /** Optional custom CSS styles for the popup container. */
    style?: React.CSSProperties;
    /** Optional callback fired when the popup opens. */
    onOpen?: (e: PopupEvent) => void;
    /** Optional callback fired when the popup closes. */
    onClose?: (e: PopupEvent) => void;
    /** Optional React node(s) to render inside the popup. */
    children?: React.ReactNode;
};

type ThreeboxLayerProps = Pick<CustomLayerProps, 'id' | 'beforeId' | 'children'> & {};
declare const ThreeboxLayer: React$1.FC<ThreeboxLayerProps>;

type ModelTypes = 'obj' | 'mtl' | 'gltf' | 'glb' | 'fbx' | 'dae';
type ModelUnits = 'meters' | 'scene';
type ModelAnchors = 'auto' | 'top' | 'bottom' | 'left' | 'right' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
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
     * @default 0
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
     * @deprecated Don't use adjustment, models should be centered in their 3D software instead
     */
    adjustment?: number | Vector3;
    /** This param allows to normalize specular values from some 3D models
     * @default true
     * @deprecated Don't use normalize, materials should be fixed in the 3D model instead
     */
    normalize?: boolean;
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
    coords?: [number, number, number] | [number, number] | number[] | Position;
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
        /** Whether to loop the path animation
         * @default false
         */
        loop?: boolean;
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
     * GeoJson feature instance. properties object of the GeoJson standard feature could be used to store relavant data
     */
    feature?: Feature$1<Point, Record<string, any>>;
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
     * @returns
     */
    onFollowPathFinish?: () => void;
};
type ModelBatchItem = {
    /** ModelLoader props */
    loader: ModelLoaderOptions;
    /** Array of ModelRenderer props - one loader can render multiple instances */
    renderers: ModelRendererOptions[];
};
type LabelRendererOptions = {
    /** Unique identifier for the model renderer instance */
    id?: string;
    /** Layer ID to which to add the model */
    layerId?: string;
    /** Position to which to move the object */
    coords?: [number, number, number] | [number, number] | number[] | Position;
    /** Style for the label */
    style?: React.CSSProperties;
};

type ModelLoaderProps = ModelLoaderOptions & {
    children?: React$1.ReactNode;
    onLoad?: (model: any) => void;
    onError?: (error: any) => void;
};
declare const ModelLoader: React$1.FC<ModelLoaderProps>;

type ModelRendererProps = ModelRendererOptions & {
    model?: any;
    layerId?: string;
    onRender?: (model: any) => void;
    onError?: (error: any) => void;
};
declare const ModelRenderer: React$1.FC<ModelRendererProps>;

type LabelRendererProps = LabelRendererOptions & {
    model?: any;
    layerId?: string;
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: any) => void;
    children?: React$1.ReactNode;
};
declare const LabelRenderer: React$1.FC<LabelRendererProps>;

interface ModelBatcherProps {
    items: ModelBatchItem[];
    worker?: number;
    batchSize?: number;
}
declare const ModelBatcher: React$1.FC<ModelBatcherProps>;

/**
 * Type definitions vendored from @maplibre/maplibre-gl-style-spec
 * These types are needed for the custom model layer implementation
 *
 * Source: mapbox-gl-js/src/style-spec/
 */

/**
 * Expression parameter types
 */
type ExpressionParameter = 'zoom' | 'feature' | 'feature-state' | 'pitch' | 'line-progress' | 'heatmap-density' | 'sky-radial-progress' | 'distance-from-center' | 'raster-value' | 'raster-particle-speed' | 'measure-light';
/**
 * Expression specification
 */
type ExpressionSpecification = {
    interpolated: boolean;
    parameters?: ExpressionParameter[];
    relaxZoomRestriction?: boolean;
};
/**
 * Expression types
 */
type ExpressionType = 'data-driven' | 'color-ramp' | 'data-constant' | 'constant';
/**
 * Base property specification
 */
type BasePropertySpecification = {
    'property-type': ExpressionType;
    expression?: ExpressionSpecification;
    transition?: boolean;
    experimental?: boolean;
    private?: boolean;
    requires?: unknown;
    appearance?: boolean;
};
/**
 * String property specification
 */
type StringPropertySpecification = BasePropertySpecification & {
    type: 'string';
    default?: string;
    tokens?: boolean;
};
/**
 * Number property specification
 */
type NumberPropertySpecification = BasePropertySpecification & {
    type: 'number';
    default?: number;
    minimum?: number;
    maximum?: number;
    units?: string;
    period?: number;
};
/**
 * Boolean property specification
 */
type BooleanPropertySpecification = BasePropertySpecification & {
    type: 'boolean';
    default?: boolean;
    overridable?: boolean;
};
/**
 * Enum property specification
 */
type EnumPropertySpecification = BasePropertySpecification & {
    type: 'enum';
    values: {
        [_: string]: unknown;
    };
    default?: string;
};
/**
 * Array property specification
 */
type ArrayPropertySpecification = BasePropertySpecification & {
    type: 'array';
    value: 'number' | 'string' | 'boolean' | 'enum';
    length?: number;
    default?: number[] | string[] | boolean[];
    minimum?: number;
    maximum?: number;
    period?: number;
    units?: string;
    values?: {
        [_: string]: unknown;
    };
};
/**
 * Style property specification (union of all property types)
 */
type StylePropertySpecification = StringPropertySpecification | NumberPropertySpecification | BooleanPropertySpecification | EnumPropertySpecification | ArrayPropertySpecification;
/**
 * Property value specification types
 */
type PropertyValueSpecification<T> = T | ExpressionSpecificationArray;
type DataDrivenPropertyValueSpecification<T> = T | ExpressionSpecificationArray;
/**
 * Expression specification (array format)
 * Examples: ['get', 'property'], ['case', condition, value1, value2, default]
 */
type ExpressionSpecificationArray = Array<unknown>;
/**
 * Feature interface for expression evaluation
 * Source: mapbox-gl-js/src/style-spec/expression/index.ts
 */
interface Feature {
    readonly type: 0 | 1 | 2 | 3 | 'Unknown' | 'Point' | 'LineString' | 'Polygon';
    readonly id?: string | number | null;
    readonly properties: Record<PropertyKey, unknown>;
    readonly patterns?: Record<PropertyKey, string[]>;
    readonly geometry?: Array<Array<{
        x: number;
        y: number;
    }>>;
}
/**
 * Global properties for expression evaluation
 */
interface GlobalProperties {
    zoom: number;
    pitch?: number;
    heatmapDensity?: number;
    lineProgress?: number;
    rasterValue?: number;
    rasterParticleSpeed?: number;
    skyRadialProgress?: number;
    brightness?: number;
    worldview?: string;
}
/**
 * Model specifications
 */
type ModelSouceSpecification = {
    id: string;
    url?: string;
    tiles?: string[];
    minzoom?: number;
    maxzoom?: number;
};
type ModelLayerSpecification = {
    id: string;
    beforeId?: string;
    source?: string;
    'source-layer'?: string;
    filter?: FilterSpecification;
    minzoom?: number;
    maxzoom?: number;
    layout?: {
        'model-id'?: string | ExpressionSpecificationArray;
        visibility?: string;
    };
    paint?: {
        'model-scale'?: DataDrivenPropertyValueSpecification<number>;
        'model-rotation'?: DataDrivenPropertyValueSpecification<number>;
        'model-translation'?: DataDrivenPropertyValueSpecification<number>;
    };
};
type ModelFeatureProperties = {
    id: string;
    model: string;
    visible: boolean;
    scale: [number, number, number];
    rotation: [number, number, number];
    translation: [number, number, number];
    properties: Record<string, any>;
    geometry: Point;
};

type ModelSourceProps = ModelSouceSpecification & {
    children?: React__default.ReactNode;
};
declare const ModelSource: React__default.FC<ModelSourceProps>;

type ModelLayerProps$1 = ModelLayerSpecification & {};
declare const ModelLayer: React__default.FC<ModelLayerProps$1>;

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

type ThreeboxRef = Threebox$1 & {
    getThreebox: () => Threebox$1 | undefined;
    [key: string]: any;
};

type ThreeboxProps = ThreeboxPluginOptions & {
    id?: string;
    mapId?: string;
    children?: React$1.ReactNode;
    onLoad?: () => void;
    onError?: (error: Error) => void;
};
declare const Threebox: React$1.ForwardRefExoticComponent<ThreeboxPluginOptions & {
    id?: string;
    mapId?: string;
    children?: React$1.ReactNode;
    onLoad?: () => void;
    onError?: (error: Error) => void;
} & React$1.RefAttributes<ThreeboxRef>>;

declare const ThreeboxProvider: React$1.FC<React$1.PropsWithChildren>;
type ThreeboxCollection = {
    [id: string]: ThreeboxRef | undefined;
    current?: ThreeboxRef;
};
declare const useThreebox: () => ThreeboxCollection;

type ModelLayerProps = ModelLayerSpecification & {};

declare class BloomRenderer {
    private _renderer;
    private _scene;
    private _camera;
    private _composer;
    private _bloomComposer;
    private _bloomPass;
    private _bloomLayer;
    private _darkMaterial;
    private _materials;
    private readonly bloomScene;
    constructor(_renderer: THREE.WebGLRenderer, _scene: THREE.Scene, _camera: THREE.PerspectiveCamera);
    setResolution(width: number, height: number): void;
    setValues(effect: Partial<EffectCanvasParams>): void;
    render(): void;
    resize(width: number, height: number): void;
    enableBloom(object: THREE.Object3D): void;
    disableBloom(object: THREE.Object3D): void;
    dispose(): void;
    private _darkenNonBloomed;
    private _restoreMaterial;
}

declare class CanvasContainer extends HTMLCanvasElement {
    constructor(map: Map);
    dispose(): void;
}

/**
 * Context value for the Canvas context
 */
type EffectCanvasContext = {
    /** Three.js scene */
    scene: THREE.Scene;
    /** Three.js camera */
    camera: THREE.PerspectiveCamera;
    /** Three.js renderer */
    renderer: THREE.WebGLRenderer;
    /** Object group container */
    group: THREE.Group;
    /** Ambient light */
    light: THREE.AmbientLight;
};
type EffectManagerContext = EffectCanvasContext & {
    /** Bloom renderer instance */
    bloom: BloomRenderer;
    /** Canvas container instance */
    container: CanvasContainer;
};
/**
 * Bloom effect parameters configuration
 */
type EffectCanvasParams = {
    /** Threshold for bloom effect (0-1) */
    threshold?: number;
    /** Strength of bloom effect (0-3) */
    strength?: number;
    /** Radius of bloom effect (0-1) */
    radius?: number;
};
/**
 * Parameters for initializing MixPass material
 */
type MixPassMaterialParams = THREE.ShaderMaterialParameters & {
    /** Bloom texture for blending */
    bloomTexture?: THREE.Texture | null;
};
/**
 * Parameters for initializing bloom line geometry
 */
type BloomLineGeometryParams = {
    /** Geometry data for the bloom effect */
    geometry?: Position[];
};
/**
 * Line configuration for bloom effect
 */
type BloomLineMaterialParams = LineMaterialParameters & {
    /** Line color (hex value) */
    color?: THREE.Color | string | number;
    /** Line width in pixels */
    linewidth?: number;
    /** Line opacity (0-1) */
    opacity?: number;
};
/**
 * Parameters for initializing extruded wall geometry
 */
type ExtrudeWallGeometryParams = {
    /** Geometry data for the extruded wall */
    geometry?: Position[];
    /** Wall height in meters */
    height?: number;
};
/**
 * Wall configuration for bloom effect
 */
type ExtrudeWallMaterialParams = THREE.ShaderMaterialParameters & {
    /** Primary color for gradient */
    colorA?: THREE.Color | string | number;
    /** Secondary color for gradient */
    colorB?: THREE.Color | string | number;
    /** Wall opacity (0-1) */
    wallOpacity?: number;
    /** Number of animated stripes */
    stripeCount?: number;
    /** Animation speed multiplier */
    speed?: number;
};

declare const EffectCanvas: React$1.ForwardRefExoticComponent<EffectCanvasParams & {
    id?: string;
    mapId?: string;
    children?: React$1.ReactNode;
    onLoad?: () => void;
    onError?: (error: Error) => void;
} & React$1.RefAttributes<EffectManagerContext>>;

type LineMeshProps = React$1.PropsWithChildren & {};
declare const _LineMesh: React$1.FC<LineMeshProps>;
declare const _LineGeometry: React$1.FC<BloomLineGeometryParams>;
declare const _LineMaterial: React$1.FC<BloomLineMaterialParams>;

type WallMeshProps = React$1.PropsWithChildren & {};
declare const _WallMesh: React$1.FC<WallMeshProps>;
declare const _WallGeometry: React$1.FC<ExtrudeWallGeometryParams>;
declare const _WallMaterial: React$1.FC<ExtrudeWallMaterialParams>;

export { type ArrayPropertySpecification, type BasePropertySpecification, _LineMesh as BloomLine, _LineGeometry as BloomLineGeometry, type BloomLineGeometryParams, _LineMaterial as BloomLineMaterial, type BloomLineMaterialParams, type BooleanPropertySpecification, CustomLayer, type DataDrivenPropertyValueSpecification, EffectCanvas, type EffectCanvasContext, type EffectCanvasParams, type EffectManagerContext, type EnumPropertySpecification, type ExpressionParameter, type ExpressionSpecification, type ExpressionSpecificationArray, type ExpressionType, _WallMesh as ExtrudeWall, _WallGeometry as ExtrudeWallGeometry, type ExtrudeWallGeometryParams, _WallMaterial as ExtrudeWallMaterial, type ExtrudeWallMaterialParams, type Feature, type GlobalProperties, LabelRenderer, type LabelRendererOptions, type LabelRendererProps, type MixPassMaterialParams, type ModelAnchors, type ModelBatchItem, ModelBatcher, type ModelBatcherProps, type ModelFeatureProperties, ModelLayer, type ModelLayerProps, type ModelLayerSpecification, ModelLoader, type ModelLoaderOptions, type ModelLoaderProps, ModelRenderer, type ModelRendererOptions, type ModelRendererProps, type ModelSouceSpecification, ModelSource, type ModelSourceProps, type ModelTypes, type ModelUnits, type NumberPropertySpecification, PopupAnimation, type PopupAnimationProps, type PropertyValueSpecification, type StringPropertySpecification, type StylePropertySpecification, Threebox, ThreeboxLayer, type ThreeboxLayerProps, type ThreeboxPluginOptions, type ThreeboxProps, ThreeboxProvider, type ThreeboxRef, useLineAnimation, useThreebox };
