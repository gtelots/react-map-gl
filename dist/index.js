'use client'
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  BloomLine: () => _LineMesh,
  BloomLineGeometry: () => _LineGeometry,
  BloomLineMaterial: () => _LineMaterial,
  CustomLayer: () => CustomLayer,
  EffectCanvas: () => EffectCanvas,
  ExtrudeWall: () => _WallMesh,
  ExtrudeWallGeometry: () => _WallGeometry,
  ExtrudeWallMaterial: () => _WallMaterial,
  ModelBatcher: () => ModelBatcher,
  ModelLoader: () => ModelLoader,
  ModelRenderer: () => ModelRenderer,
  PopupAnimation: () => PopupAnimation,
  Threebox: () => Threebox2,
  ThreeboxInstance: () => import_threebox_plugin.Threebox,
  ThreeboxLayer: () => ThreeboxLayer,
  ThreeboxProvider: () => ThreeboxProvider,
  useLineAnimation: () => useLineAnimation,
  useThreebox: () => useThreebox
});
module.exports = __toCommonJS(index_exports);
__reExport(index_exports, require("react-map-gl/maplibre"), module.exports);

// src/modules/react-maplibre/components/custom-layer.tsx
var React = __toESM(require("react"));
var import_maplibre = require("react-map-gl/maplibre");

// src/utils/assert.ts
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// src/utils/use-isomorphic-layout-effect.ts
var import_react = require("react");
var useIsomorphicLayoutEffect = typeof document !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect;
var use_isomorphic_layout_effect_default = useIsomorphicLayoutEffect;

// src/modules/react-maplibre/components/custom-layer.tsx
var useLatestRef = (value) => {
  const ref = React.useRef(value);
  ref.current = value;
  return ref;
};
var updateCustomLayer = (map, id, props, prevProps) => {
  assert(props.id === prevProps.id, "layer id changed");
  if (props.beforeId !== prevProps.beforeId) {
    map.moveLayer(id, props.beforeId);
  }
};
var createCustomLayer = (map, id, props, handlers) => {
  const layer = {
    id,
    type: "custom",
    renderingMode: "3d",
    onAdd: (m, gl) => {
      handlers.onAddRef.current?.(m, gl);
    },
    prerender: (gl, matrix, options) => {
      handlers.prerenderRef.current?.(gl, matrix, options);
    },
    render: (gl, matrix, options) => {
      handlers.renderRef.current?.(gl, matrix, options);
    },
    onRemove: (m, gl) => {
      handlers.onRemoveRef.current?.(m, gl);
    }
  };
  map.addLayer(layer, props.beforeId);
};
var layerCounter = 0;
var CustomLayer = ({
  onAdd,
  prerender,
  render,
  onRemove,
  onMount,
  onUnmount,
  children,
  ...props
}) => {
  const map = (0, import_maplibre.useMap)().current?.getMap();
  const propsRef = React.useRef(props);
  const [, setStyleLoaded] = React.useState(0);
  const id = React.useMemo(() => props.id || `custom-layer-${layerCounter++}`, []);
  const memorizedProps = React.useMemo(
    () => ({
      ...props,
      type: "custom",
      renderingMode: "3d"
    }),
    [Object.values(props).join(",")]
  );
  const onAddRef = useLatestRef(onAdd);
  const prerenderRef = useLatestRef(prerender);
  const renderRef = useLatestRef(render);
  const onRemoveRef = useLatestRef(onRemove);
  React.useEffect(() => {
    if (!map) return;
    const forceUpdate = () => setStyleLoaded((v) => v + 1);
    map.on("styledata", forceUpdate);
    forceUpdate();
    onMount?.();
    return () => {
      map.off("styledata", forceUpdate);
      if (map.style && map.style._loaded && map.getLayer(id)) {
        map.removeLayer(id);
        onUnmount?.();
      }
    };
  }, [map, id, onMount, onUnmount]);
  use_isomorphic_layout_effect_default(() => {
    if (!map) return;
    const layer = map.style && map.style._loaded && map.getLayer(id);
    if (layer) {
      updateCustomLayer(map, id, memorizedProps, propsRef.current);
    } else {
      createCustomLayer(map, id, memorizedProps, {
        onAddRef,
        prerenderRef,
        renderRef,
        onRemoveRef
      });
    }
    propsRef.current = memorizedProps;
  }, [map, id, memorizedProps]);
  return children;
};

// src/modules/react-maplibre/components/popup-animation.tsx
var React3 = __toESM(require("react"));
var import_react_dom = require("react-dom");
var import_maplibre2 = require("react-map-gl/maplibre");

// src/modules/react-maplibre/lib/animated-popup.js
var import_maplibre_gl = require("maplibre-gl");
var effects = {
  linear(t) {
    return t;
  },
  easeInQuad(t) {
    return t * t;
  },
  easeOutQuad(t) {
    return -t * (t - 2);
  },
  easeInOutQuad(t) {
    if ((t /= 0.5) < 1) {
      return 0.5 * t * t;
    }
    return -0.5 * (--t * (t - 2) - 1);
  },
  easeInCubic(t) {
    return t * t * t;
  },
  easeOutCubic(t) {
    return (t -= 1) * t * t + 1;
  },
  easeInOutCubic(t) {
    if ((t /= 0.5) < 1) {
      return 0.5 * t * t * t;
    }
    return 0.5 * ((t -= 2) * t * t + 2);
  },
  easeInQuart(t) {
    return t * t * t * t;
  },
  easeOutQuart(t) {
    return -((t -= 1) * t * t * t - 1);
  },
  easeInOutQuart(t) {
    if ((t /= 0.5) < 1) {
      return 0.5 * t * t * t * t;
    }
    return -0.5 * ((t -= 2) * t * t * t - 2);
  },
  easeInQuint(t) {
    return t * t * t * t * t;
  },
  easeOutQuint(t) {
    return (t -= 1) * t * t * t * t + 1;
  },
  easeInOutQuint(t) {
    if ((t /= 0.5) < 1) {
      return 0.5 * t * t * t * t * t;
    }
    return 0.5 * ((t -= 2) * t * t * t * t + 2);
  },
  easeInSine(t) {
    return -Math.cos(t * (Math.PI / 2)) + 1;
  },
  easeOutSine(t) {
    return Math.sin(t * (Math.PI / 2));
  },
  easeInOutSine(t) {
    return -0.5 * (Math.cos(Math.PI * t) - 1);
  },
  easeInExpo(t) {
    return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
  },
  easeOutExpo(t) {
    return t === 1 ? 1 : -Math.pow(2, -10 * t) + 1;
  },
  easeInOutExpo(t) {
    if (t === 0) {
      return 0;
    }
    if (t === 1) {
      return 1;
    }
    if ((t /= 0.5) < 1) {
      return 0.5 * Math.pow(2, 10 * (t - 1));
    }
    return 0.5 * (-Math.pow(2, -10 * --t) + 2);
  },
  easeInCirc(t) {
    if (t >= 1) {
      return t;
    }
    return -(Math.sqrt(1 - t * t) - 1);
  },
  easeOutCirc(t) {
    return Math.sqrt(1 - (t -= 1) * t);
  },
  easeInOutCirc(t) {
    if ((t /= 0.5) < 1) {
      return -0.5 * (Math.sqrt(1 - t * t) - 1);
    }
    return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
  },
  easeInElastic(t) {
    let s = 1.70158;
    let p = 0;
    let a = 1;
    if (t === 0) {
      return 0;
    }
    if (t === 1) {
      return 1;
    }
    if (!p) {
      p = 0.3;
    }
    if (a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(1 / a);
    }
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
  },
  easeOutElastic(t) {
    let s = 1.70158;
    let p = 0;
    let a = 1;
    if (t === 0) {
      return 0;
    }
    if (t === 1) {
      return 1;
    }
    if (!p) {
      p = 0.3;
    }
    if (a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(1 / a);
    }
    return a * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
  },
  easeInOutElastic(t) {
    let s = 1.70158;
    let p = 0;
    let a = 1;
    if (t === 0) {
      return 0;
    }
    if ((t /= 0.5) === 2) {
      return 1;
    }
    if (!p) {
      p = 0.45;
    }
    if (a < 1) {
      a = 1;
      s = p / 4;
    } else {
      s = p / (2 * Math.PI) * Math.asin(1 / a);
    }
    if (t < 1) {
      return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
    }
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p) * 0.5 + 1;
  },
  easeInBack(t) {
    const s = 1.70158;
    return t * t * ((s + 1) * t - s);
  },
  easeOutBack(t) {
    const s = 1.70158;
    return (t -= 1) * t * ((s + 1) * t + s) + 1;
  },
  easeInOutBack(t) {
    let s = 1.70158;
    if ((t /= 0.5) < 1) {
      return 0.5 * (t * t * (((s *= 1.525) + 1) * t - s));
    }
    return 0.5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
  },
  easeInBounce(t) {
    return 1 - effects.easeOutBounce(1 - t);
  },
  easeOutBounce(t) {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    }
    if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    }
    if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    }
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  },
  easeInOutBounce(t) {
    if (t < 0.5) {
      return effects.easeInBounce(t * 2) * 0.5;
    }
    return effects.easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
  }
};
var transforms = {
  scale: (style, value, reverse) => {
    style.transform = `scale(${reverse ? 1 - value : value})`;
  },
  opacity: (style, value, reverse) => {
    style.opacity = reverse ? 1 - value : value;
  }
};
function animate(style, ease, duration, reverse, complete, transform) {
  let cancel;
  const applyTransform = typeof transform === "string" ? transforms[transform] || transforms.scale : transform;
  const start = performance.now();
  const repeat = () => {
    if (cancel) {
      return;
    }
    const elapsed = performance.now() - start;
    const t = duration === 0 ? 1 : Math.min(elapsed / duration, 1);
    const value = effects[ease](t);
    applyTransform(style, value, reverse);
    if (t < 1) {
      requestAnimationFrame(repeat);
    } else if (complete) {
      complete();
    }
  };
  repeat();
  return () => {
    cancel = true;
  };
}
function extend(dest, ...sources) {
  for (const src of sources) {
    for (const k in src) {
      if (typeof src[k] === "object") {
        if (!dest[k]) {
          dest[k] = {};
        }
        extend(dest[k], src[k]);
      } else {
        dest[k] = src[k];
      }
    }
  }
  return dest;
}
var defaultOptions = {
  openingAnimation: {
    transform: "scale",
    duration: 1e3,
    easing: "easeOutElastic"
  },
  closingAnimation: {
    transform: "scale",
    duration: 300,
    easing: "easeInBack"
  }
};
var AnimatedPopup = class extends import_maplibre_gl.Popup {
  constructor(options) {
    super(options);
    extend(this.options, extend({}, defaultOptions, options));
    this._animated = false;
    this._contentWrapper = null;
  }
  setDOMContent(htmlNode) {
    const wrapper = document.createElement("div");
    wrapper.className = "popup-animated-content";
    wrapper.appendChild(htmlNode);
    this._contentWrapper = wrapper;
    return super.setDOMContent(wrapper);
  }
  addTo(map) {
    if (this._contentWrapper) {
      this.remove();
    }
    this._runOpenAnimation();
    setTimeout(() => {
      super.addTo(map);
    }, 0);
    return this;
  }
  _runOpenAnimation() {
    if (this._animated) return;
    const wrapper = this._contentWrapper;
    if (!wrapper) return;
    const { easing, duration, transform } = this.options.openingAnimation;
    this._cancelAnimation = animate(wrapper.style, easing, duration, false, null, transform);
    this._animated = true;
  }
  remove() {
    const wrapper = this._contentWrapper;
    if (wrapper) {
      const { easing, duration, transform } = this.options.closingAnimation;
      if (this._cancelAnimation) this._cancelAnimation();
      this._cancelAnimation = animate(wrapper.style, easing, duration, true, () => {
        super.remove();
        this._animated = false;
      }, transform);
    } else {
      super.remove();
      this._animated = false;
    }
    return this;
  }
};

// src/utils/apply-react-style.ts
var React2 = require("react");
var unitlessNumber = /box|flex|grid|column|lineHeight|fontWeight|opacity|order|tabSize|zIndex/;
function applyReactStyle(element, styles) {
  if (!element || !styles) {
    return;
  }
  const style = element.style;
  for (const key in styles) {
    const value = styles[key];
    if (Number.isFinite(value) && !unitlessNumber.test(key)) {
      style[key] = `${value}px`;
    } else {
      style[key] = value;
    }
  }
}

// src/utils/deep-equal.ts
function deepEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) {
        return false;
      }
    }
    return true;
  } else if (Array.isArray(b)) {
    return false;
  }
  if (typeof a === "object" && typeof b === "object") {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
      return false;
    }
    for (const key of aKeys) {
      if (!b.hasOwnProperty(key)) {
        return false;
      }
      if (!deepEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  return false;
}

// src/utils/compare-class-names.ts
function compareClassNames(prevClassName, nextClassName) {
  if (prevClassName === nextClassName) {
    return null;
  }
  const prevClassList = getClassList(prevClassName);
  const nextClassList = getClassList(nextClassName);
  const diff = [];
  for (const c of nextClassList) {
    if (!prevClassList.has(c)) {
      diff.push(c);
    }
  }
  for (const c of prevClassList) {
    if (!nextClassList.has(c)) {
      diff.push(c);
    }
  }
  return diff.length === 0 ? null : diff;
}
function getClassList(className) {
  return new Set(className ? className.trim().split(/\s+/) : []);
}

// src/modules/react-maplibre/components/popup-animation.tsx
var defaultOptions2 = {
  maxWidth: "350px",
  anchor: "bottom",
  closeButton: false,
  closeOnClick: true,
  closeOnMove: false,
  focusAfterOpen: true
};
var _PopupAnimation = React3.forwardRef((props, ref) => {
  const map = (0, import_maplibre2.useMap)().current;
  const { longitude, latitude, style, children, onOpen, onClose, ...popupOptions } = props;
  const container = React3.useMemo(() => document.createElement("div"), []);
  const propsRef = React3.useRef(props);
  const popup = React3.useMemo(() => {
    const pp = new AnimatedPopup({ ...defaultOptions2, ...popupOptions });
    pp.setLngLat([longitude, latitude]);
    pp.once("open", (e) => {
      propsRef.current.onOpen?.(e);
    });
    return pp;
  }, []);
  const handleClose = React3.useCallback((e) => {
    propsRef.current.onClose?.(e);
  }, []);
  React3.useEffect(() => {
    if (!map) {
      return;
    }
    popup.on("close", handleClose);
    popup.setDOMContent(container).addTo(map.getMap());
    return () => {
      popup.off("close", handleClose);
      if (popup.isOpen()) {
        popup.remove();
        propsRef.current.onClose?.({ target: popup, type: "close" });
      }
    };
  }, [popup, map, container, handleClose]);
  React3.useEffect(() => {
    applyReactStyle(popup.getElement(), style || {});
  }, [style, popup]);
  React3.useImperativeHandle(ref, () => popup, [popup]);
  if (popup.isOpen()) {
    const oldProps = propsRef.current;
    if (popup.getLngLat().lng !== longitude || popup.getLngLat().lat !== latitude) {
      popup.setLngLat([longitude, latitude]);
    }
    if (props.offset && !deepEqual(oldProps.offset, props.offset)) {
      popup.options.anchor = props.anchor;
      popup.setOffset(props.offset);
    }
    if (oldProps.anchor !== props.anchor || oldProps.maxWidth !== props.maxWidth) {
      popup.setMaxWidth(props.maxWidth);
    }
    const classNameDiff = compareClassNames(oldProps.className, props.className);
    if (classNameDiff) {
      for (const c of classNameDiff) {
        popup.toggleClassName(c);
      }
    }
    propsRef.current = props;
  }
  return (0, import_react_dom.createPortal)(children, container);
});
var PopupAnimation = React3.memo(_PopupAnimation);

// src/modules/react-maplibre/components/use-line-animation.tsx
var import_maplibre_gl2 = require("maplibre-gl");
var import_react2 = require("react");
var dashArraySequence = [
  [0, 4, 3],
  [0.5, 4, 2.5],
  [1, 4, 2],
  [1.5, 4, 1.5],
  [2, 4, 1],
  [2.5, 4, 0.5],
  [3, 4, 0],
  [0, 0.5, 3, 3.5],
  [0, 1, 3, 3],
  [0, 1.5, 3, 2.5],
  [0, 2, 3, 2],
  [0, 2.5, 3, 1.5],
  [0, 3, 3, 1],
  [0, 3.5, 3, 0.5]
];
function animateDashArray(map, layerId, speed) {
  let step = 0;
  function animateDashArray2(timestamp) {
    const newStep = Math.floor(timestamp / speed % dashArraySequence.length);
    if (newStep !== step && map.getLayer(layerId)) {
      map.setPaintProperty(layerId, "line-dasharray", dashArraySequence[step]);
      step = newStep;
    }
    requestAnimationFrame(animateDashArray2);
  }
  animateDashArray2(0);
}
var useLineAnimation = ({ map, layerId, speed = 50 }) => {
  const lineAnimation = (0, import_react2.useCallback)(() => {
    if (!map) return;
    const waitForLayer = () => {
      const layer = map.getLayer(layerId);
      if (layer) {
        if (layer.type !== "line") {
          throw new Error(`Layer ${layerId} is not a line layer`);
        }
        animateDashArray(map, layerId, speed);
      } else {
        setTimeout(waitForLayer, 100);
      }
    };
    waitForLayer();
  }, [map, layerId, speed]);
  (0, import_react2.useEffect)(() => {
    map?.on("style.load", lineAnimation);
    return () => {
      map?.off("style.load", lineAnimation);
    };
  }, [map, lineAnimation]);
  return {};
};

// src/modules/react-maplibre/types/lib.ts
var import_maplibre_gl3 = require("maplibre-gl");

// src/modules/react-threebox/components/threebox-layer.tsx
var React6 = __toESM(require("react"));

// src/modules/react-threebox/components/threebox.tsx
var React5 = __toESM(require("react"));
var import_maplibre3 = require("react-map-gl/maplibre");

// src/modules/react-threebox/threebox/create-ref.ts
function createThreeboxRef(tbInstance) {
  if (!tbInstance) {
    return void 0;
  }
  let tb = tbInstance.tb;
  if (!tb) {
    return void 0;
  }
  const result = {
    getThreebox: () => tb
  };
  for (const key of getMethodNames(tb)) {
    if (!(key in result)) {
      result[key] = tb[key].bind(tb);
    }
  }
  return result;
}
function getMethodNames(obj) {
  const result = /* @__PURE__ */ new Set();
  let proto = obj;
  while (proto) {
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (key[0] !== "_" && typeof obj[key] === "function" && key !== "fire" && key !== "setEventedParent") {
        result.add(key);
      }
    }
    proto = Object.getPrototypeOf(proto);
  }
  return Array.from(result);
}

// src/modules/react-threebox/components/use-threebox.tsx
var React4 = __toESM(require("react"));
var import_jsx_runtime = require("react/jsx-runtime");
var MountedThreeboxContext = React4.createContext(null);
var ThreeboxProvider = ({ children }) => {
  const [threeboxes, setThreeboxes] = React4.useState({});
  const mountThreebox = React4.useCallback((tb, id = "default") => {
    setThreeboxes((currTbs) => {
      if (id === "current") {
        throw new Error('"current" cannot be used as a Threebox id');
      }
      if (currTbs[id]) {
        throw new Error(`Multiple Threebox instances with the same id: ${id}`);
      }
      return { ...currTbs, [id]: tb };
    });
  }, []);
  const unmountThreebox = React4.useCallback((id = "default") => {
    setThreeboxes((currTbs) => {
      if (!!currTbs[id]) {
        const nextTbs = { ...currTbs };
        delete nextTbs[id];
        return nextTbs;
      }
      return currTbs;
    });
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    MountedThreeboxContext.Provider,
    {
      value: {
        threeboxes,
        mountThreebox,
        unmountThreebox
      },
      children
    }
  );
};
var useThreebox = () => {
  const tbs = React4.useContext(MountedThreeboxContext)?.threeboxes;
  const currTb = React4.useContext(ThreeboxContext);
  const tbsWithCurrent = React4.useMemo(() => {
    return { ...tbs, current: currTb?.threebox };
  }, [tbs, currTb]);
  return tbsWithCurrent;
};

// src/modules/react-threebox/types/lib.ts
var import_threebox_plugin = require("threebox-plugin");

// src/modules/react-threebox/threebox/threebox-plugin.ts
var ThreeboxPlugin = class {
  _tb = void 0;
  _map = void 0;
  props;
  constructor(props, map) {
    this.props = props;
    this._map = map;
    this._initialize(map);
  }
  get tb() {
    return this._tb;
  }
  get map() {
    return this._map;
  }
  _initialize(map) {
    assert(map, "Map is required to initialize Threebox");
    if (Object.getOwnPropertyDescriptor(map, "version") === void 0) {
      Object.defineProperty(map, "version", { get: function() {
        return "1.0";
      } });
    }
    const tb = new import_threebox_plugin.Threebox(map, map?.getCanvas().getContext("webgl"), this.props);
    this._tb = tb;
  }
  destroy() {
    assert(this._tb, "Threebox is not initialized");
    this._tb?.dispose();
  }
  redraw() {
    assert(this._tb, "Threebox is not initialized");
    this._tb?.update();
  }
};

// src/modules/react-threebox/components/threebox.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var ThreeboxContext = React5.createContext(null);
var defaultOptions3 = {
  defaultLights: true,
  enableSelectingFeatures: true,
  enableSelectingObjects: true,
  enableDraggingObjects: false,
  enableRotatingObjects: false,
  enableTooltips: false,
  enableHelpTooltips: false,
  multiLayer: true,
  orthographic: false,
  cache: {
    cacheName: "threebox-models",
    maxAge: 1 * 24 * 60 * 60 * 1e3,
    maxCacheEntries: 200
  }
};
var _Threebox = (props, ref) => {
  const { id, mapId, children, onError, onLoad, ...options } = props;
  const mapRef = (0, import_maplibre3.useMap)();
  const mountedThreeboxContext = React5.useContext(MountedThreeboxContext);
  const [tbInstance, setTbInstance] = React5.useState(null);
  const initialOptionsRef = React5.useRef(options);
  const { current: contextValue } = React5.useRef({
    threebox: void 0,
    map: void 0
  });
  const tbOptions = React5.useMemo(() => {
    const newOptions = { ...options };
    delete newOptions.realSunlight;
    delete newOptions.realSunlightHelper;
    delete newOptions.sky;
    delete newOptions.terrain;
    return { ...defaultOptions3, ...newOptions };
  }, [
    options.defaultLights,
    options.enableSelectingFeatures,
    options.enableSelectingObjects,
    options.enableDraggingObjects,
    options.enableRotatingObjects,
    options.enableTooltips,
    options.enableHelpTooltips,
    options.multiLayer,
    options.orthographic,
    options.cache?.cacheName,
    options.cache?.maxAge,
    options.cache?.maxCacheEntries
  ]);
  React5.useEffect(() => {
    let isMounted = true;
    let tbPlugin = null;
    const mapInstance = mapRef?.[mapId || "current"]?.getMap();
    try {
      if (!isMounted) {
        return;
      }
      if (!tbPlugin) {
        mapInstance?.on("style.load", () => {
          tbPlugin = new ThreeboxPlugin(tbOptions, mapInstance);
          const tbRef = createThreeboxRef(tbPlugin);
          contextValue.threebox = tbRef;
          contextValue.map = mapInstance;
          onLoad?.();
          setTbInstance(tbPlugin);
          mountedThreeboxContext?.mountThreebox(contextValue.threebox, id);
        });
      }
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      } else {
        console.error(error);
      }
    }
    return () => {
      isMounted = false;
      if (tbPlugin) {
        mountedThreeboxContext?.unmountThreebox(id);
        tbPlugin.destroy();
      }
    };
  }, []);
  use_isomorphic_layout_effect_default(() => {
    if (tbInstance && initialOptionsRef.current) {
      if (!deepEqual(options, initialOptionsRef.current)) {
        mountedThreeboxContext?.unmountThreebox(id);
        tbInstance.destroy();
        throw new Error("Threebox props cannot be changed after initialization");
      }
    }
  }, [options, tbInstance]);
  React5.useImperativeHandle(ref, () => contextValue.threebox, [tbInstance]);
  return tbInstance && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ThreeboxContext.Provider, { value: contextValue, children });
};
var Threebox2 = React5.forwardRef(_Threebox);

// src/modules/react-threebox/components/threebox-layer.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var ThreeboxLayerContext = React6.createContext(null);
var layerCounter2 = 0;
var ThreeboxLayer = ({ id, beforeId, children }) => {
  const { threebox } = React6.useContext(ThreeboxContext) || {};
  const tb = threebox?.getThreebox();
  const layerId = React6.useMemo(() => id || `threebox-layer-${layerCounter2++}`, [id]);
  const mountFunction = React6.useCallback(() => {
    if (tb) {
      tb.update();
      tb.map.repaint = true;
    }
  }, [tb]);
  const unmountFunction = React6.useCallback(() => {
    if (tb) {
      tb.clear(layerId, true);
    }
  }, [tb, layerId]);
  const contextValue = React6.useMemo(() => ({ layerId }), [layerId]);
  const layerProps = React6.useMemo(
    () => ({
      onAdd: mountFunction,
      render: mountFunction,
      onRemove: unmountFunction,
      beforeId,
      id: layerId
    }),
    [layerId, beforeId, mountFunction, unmountFunction]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(ThreeboxLayerContext.Provider, { value: contextValue, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CustomLayer, { ...layerProps, onMount: mountFunction, onUnmount: unmountFunction, children }) });
};

// src/modules/react-threebox/components/model-loader.tsx
var React7 = __toESM(require("react"));
var updateModel = (model, props, prevProps) => {
  assert(props.id === prevProps.id, "model id changed");
  if (props.type !== prevProps.type || props.obj !== prevProps.obj || props.units !== prevProps.units) {
    console.warn("Model properties changed, reloading the model");
    model.dispose();
    return null;
  }
  if (!deepEqual(props.rotation, prevProps.rotation)) {
    model.setRotationAxis(props.rotation);
  }
  if (!deepEqual(props.scale, prevProps.scale)) {
    model.setScale(props.scale);
  }
  if (props.anchor !== prevProps.anchor) {
    model.setAnchor(props.anchor);
  }
  if (deepEqual(props.feature, prevProps.feature)) {
    model.userData.feature = props.feature;
  }
  model.userData.model = { ...props };
  return model;
};
var createModel = async (tb, props) => {
  if (tb) {
    const model = await tb.loadObj(props);
    model.userData.model = { ...props };
    return model;
  }
  return null;
};
var getModelById = (tb, id) => {
  return tb?.world.children.find((child) => {
    return child.userData.model.id === id;
  });
};
var getModelsById = (tb, id) => {
  return tb?.world.children.filter((child) => {
    return child.userData.model.id === id;
  });
};
var modelCounter = 0;
var defaultProps = {
  id: `model-${modelCounter++}`,
  type: "glb",
  obj: "",
  units: "meters",
  rotation: { x: 90, y: 180, z: 0 },
  scale: 1,
  anchor: "auto",
  bbox: false,
  clone: true
};
var ModelLoader = ({
  children,
  onLoad,
  onError,
  ...props
}) => {
  const { threebox, map } = React7.useContext(ThreeboxContext) || {};
  const tb = threebox?.getThreebox();
  const propsRef = React7.useRef({});
  const [modelInstance, setModelInstance] = React7.useState(null);
  const loaderProps = React7.useMemo(() => {
    const newProps = { ...props };
    delete newProps.mtl;
    delete newProps.bin;
    delete newProps.adjustment;
    delete newProps.normalize;
    delete newProps.tooltip;
    delete newProps.bbox;
    delete newProps.raycasted;
    delete newProps.clone;
    delete newProps.defaultAnimation;
    return { ...defaultProps, ...newProps };
  }, [
    props.anchor,
    props.feature,
    props.id,
    props.obj,
    props.rotation,
    props.scale,
    props.type,
    props.units
  ]);
  const loadModel = React7.useCallback(async () => {
    if (!tb) return;
    const id = loaderProps.id;
    let model = map && map.style && map.style._loaded && getModelById(tb, id);
    try {
      if (model) {
        const models = getModelsById(tb, id);
        models.forEach((m) => updateModel(m, loaderProps, propsRef.current));
      } else {
        model = await createModel(tb, loaderProps);
      }
      onLoad?.(model);
      propsRef.current = loaderProps;
    } catch (error) {
      console.error(`Error loading model ${id}:`, error);
      onError?.(error);
    } finally {
      setModelInstance(model || null);
    }
  }, [tb, map, loaderProps, onLoad, onError]);
  React7.useEffect(() => {
    loadModel();
  }, [loadModel]);
  const childrenWithModel = React7.useMemo(() => {
    return modelInstance && React7.Children.map(children, (child) => {
      if (child && React7.isValidElement(child)) {
        return React7.cloneElement(child, { model: modelInstance });
      }
      return child;
    });
  }, [modelInstance, children]);
  return childrenWithModel;
};

// src/modules/react-threebox/components/model-renderer.tsx
var React8 = __toESM(require("react"));
var import_gsap = require("gsap");

// src/utils/update-properties.ts
function updateProperties(nextProps, currProps, defProps, obj, propsNames) {
  for (const propName of propsNames) {
    const newValue = nextProps[propName];
    const oldValue = currProps[propName];
    if (!deepEqual(newValue, oldValue)) {
      const defaultValue = defProps[propName];
      obj[propName] = newValue || defaultValue;
    }
  }
  return obj;
}

// src/modules/react-threebox/components/model-renderer.tsx
var pointerEvents = {
  SelectedChange: "onSelectedChange",
  Wireframed: "onWireframed",
  IsPlayingChanged: "onIsPlayingChanged",
  ObjectDragged: "onDraggedObject",
  ObjectMouseOver: "onObjectMouseOver",
  ObjectMouseOut: "onObjectMouseOut"
};
var propertyNames = ["wireframe", "visibility", "hidden"];
var addModel = (tb, props, model) => {
  const currentScale = model.scale.z;
  const originZ = currentScale / 2;
  const targetZ = currentScale;
  const renderingEffect = props.renderingEffect;
  if (renderingEffect) {
    model.scale.z = originZ;
  }
  setTimeout(() => {
    tb.add(model, props.layerId);
  }, 50);
  if (renderingEffect) {
    const duration = (renderingEffect.duration || 500) / 1e3;
    const ease = renderingEffect.easing || ((t) => t);
    setTimeout(() => {
      import_gsap.gsap.to(model.scale, { z: targetZ, duration, ease });
    }, 100);
  }
};
var rerenderModel = (model, props, prevProps, defaultProps3) => {
  model.name = props.id;
  model.userData.id = props.id;
  model = updateProperties(props, prevProps, defaultProps3, model, propertyNames);
  if (props.coords && !deepEqual(props.coords, prevProps.coords)) {
    model.setCoords(props.coords);
  }
  if (props.rotation && !deepEqual(props.rotation, prevProps.rotation)) {
    model.setRotation(props.rotation);
  }
  if (props.scale && !deepEqual(props.scale, prevProps.scale)) {
    model.setScale(props.scale);
  }
  if (props.animationOptions && !deepEqual(props.animationOptions, prevProps.animationOptions)) {
    model.playAnimation(props.animationOptions);
  } else if (!props.animationOptions && prevProps.animationOptions) {
    model.stop();
  }
  if (props.pathOptions && !deepEqual(props.pathOptions, prevProps.pathOptions)) {
    model.followPath(props.pathOptions, props.onFollowPathFinish);
  } else if (!props.pathOptions && prevProps.pathOptions) {
    model.stop();
  }
  for (const eventName in pointerEvents) {
    const eveName = eventName;
    const eventProps = props[pointerEvents[eveName]];
    const prevEventProps = prevProps[pointerEvents[eveName]];
    if (eventProps !== prevEventProps) {
      if (prevEventProps) {
        model.removeEventListener(eventName, prevEventProps);
      }
      if (eventProps) {
        model.addEventListener(eventName, eventProps, false);
      }
    }
  }
};
var defaultProps2 = {
  wireframe: false,
  visibility: true,
  hidden: false
};
var ModelRenderer = ({ model, onRender, ...props }) => {
  const { threebox, map } = React8.useContext(ThreeboxContext) || {};
  const { layerId } = React8.useContext(ThreeboxLayerContext) || {};
  const tb = threebox?.getThreebox();
  const propsRef = React8.useRef({});
  const { current: modelRef } = React8.useRef(model.duplicate());
  const isRendered = React8.useRef(false);
  const renderProps = React8.useMemo(
    () => ({
      ...defaultProps2,
      ...props,
      layerId
    }),
    [props, layerId]
  );
  React8.useEffect(() => {
    if (map) {
      return () => {
        if (tb && modelRef) {
          tb.remove(modelRef);
          propsRef.current = {};
          isRendered.current = false;
        }
      };
    }
    return void 0;
  }, [map]);
  React8.useEffect(() => {
    if (modelRef) {
      rerenderModel(modelRef, renderProps, propsRef.current, defaultProps2);
      if (!isRendered.current && tb) {
        addModel(tb, renderProps, modelRef);
        onRender?.(modelRef);
        isRendered.current = true;
      }
    } else {
      throw new Error("Model not found in Threebox instance.");
    }
    propsRef.current = renderProps;
  }, [tb, renderProps, onRender]);
  return null;
};

// src/modules/react-threebox/components/model-batcher.tsx
var React9 = __toESM(require("react"));
var import_jsx_runtime4 = require("react/jsx-runtime");
var useShouldRender = (batchIndex, batchSize, batchDelay) => {
  const [shouldRender, setShouldRender] = React9.useState(false);
  React9.useEffect(() => {
    const delay = Math.floor(batchIndex / batchSize) * batchDelay;
    const timer = setTimeout(() => setShouldRender(true), delay);
    return () => clearTimeout(timer);
  }, [batchIndex, batchSize, batchDelay]);
  return shouldRender;
};
var BatchedModelRenderer = ({
  batchIndex,
  batchSize,
  batchDelay,
  ...props
}) => {
  const shouldRender = useShouldRender(batchIndex, batchSize, batchDelay);
  if (!shouldRender) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ModelRenderer, { ...props });
};
var BatchedModelLoader = ({
  batchIndex,
  batchSize,
  batchDelay,
  ...props
}) => {
  const shouldRender = useShouldRender(batchIndex, batchSize, batchDelay);
  if (!shouldRender) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ModelLoader, { ...props });
};
var ModelBatcher = ({
  models,
  batchSize = 10,
  batchDelay = 100
}) => {
  return models.map((model, loaderIndex) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    BatchedModelLoader,
    {
      ...model.loader,
      batchIndex: loaderIndex,
      batchSize,
      batchDelay,
      children: model.renderers.map((props, renderIndex) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        BatchedModelRenderer,
        {
          ...props,
          batchIndex: renderIndex,
          batchSize,
          batchDelay
        },
        props.id
      ))
    },
    model.loader.id
  ));
};

// src/modules/react-threejs/components/effect-canvas.tsx
var React10 = __toESM(require("react"));
var import_maplibre4 = require("react-map-gl/maplibre");

// src/modules/react-threejs/threejs/graphics/effect-manager.ts
var THREE8 = require("three");

// src/modules/react-threejs/threejs/graphics/canvas-container.ts
var CanvasContainer = class extends HTMLCanvasElement {
  constructor(map) {
    const mapContainer = map.getContainer();
    const selectorId = "_THREE_CANVAS_CONTAINER_";
    let existingContainer = mapContainer.querySelector(`#${selectorId}`);
    if (existingContainer) {
      return existingContainer;
    }
    super();
    this.id = selectorId;
    this.style.position = "absolute";
    this.style.zIndex = "99999";
    this.style.pointerEvents = "none";
    this.style.width = "100%";
    this.style.height = "100%";
    const mapCanvas = map.getCanvas();
    this.width = mapCanvas.clientWidth;
    this.height = mapCanvas.clientHeight;
    mapContainer.appendChild(this);
  }
  dispose() {
    this.remove();
  }
};
window.customElements.define("canvas-container", CanvasContainer, { extends: "canvas" });

// src/modules/react-threejs/threejs/graphics/webgl-shader-manager.ts
var WebGLShaderManager = class {
  program = null;
  gl;
  locations = {};
  buffers = {};
  texture = null;
  get vertexShaderSource() {
    return `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;
      
      void main() {
        vec2 zeroToOne = a_position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        v_texCoord = a_texCoord;
      }
    `;
  }
  get fragmentShaderSource() {
    return `
      #ifdef GL_ES
      precision mediump float;
      #endif
      
      uniform sampler2D u_image;
      varying vec2 v_texCoord;
      
      void main() {
        gl_FragColor = texture2D(u_image, v_texCoord);
      }
    `;
  }
  constructor(gl) {
    this.gl = gl;
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, this.vertexShaderSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, this.fragmentShaderSource);
    if (!vertexShader || !fragmentShader) {
      throw new Error("Failed to create shaders");
    }
    this.program = this.createProgram(vertexShader, fragmentShader);
    if (!this.program) {
      throw new Error("Failed to create program");
    }
    this.locations.position = this.gl.getAttribLocation(this.program, "a_position");
    this.locations.texcoord = this.gl.getAttribLocation(this.program, "a_texCoord");
    this.locations.resolution = this.gl.getUniformLocation(this.program, "u_resolution");
    this.locations.image = this.gl.getUniformLocation(this.program, "u_image");
    this.buffers.position = this.gl.createBuffer();
    this.buffers.texcoord = this.gl.createBuffer();
    this.texture = this.gl.createTexture();
    this.gl.deleteShader(vertexShader);
    this.gl.deleteShader(fragmentShader);
  }
  createShader(type, source) {
    const shader = this.gl.createShader(type);
    if (!shader) {
      console.error("Failed to create shader");
      return null;
    }
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const error = this.gl.getShaderInfoLog(shader);
      console.error(`Shader compilation error: ${error}`);
      this.gl.deleteShader(shader);
      return null;
    }
    return shader;
  }
  createProgram(vertexShader, fragmentShader) {
    const program = this.gl.createProgram();
    if (!program) {
      console.error("Failed to create program");
      return null;
    }
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const error = this.gl.getProgramInfoLog(program);
      console.error(`Program linking error: ${error}`);
      this.gl.deleteProgram(program);
      return null;
    }
    return program;
  }
  setRectangle(x, y, width, height) {
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
      this.gl.STATIC_DRAW
    );
  }
  render(bloomContainer, containerWidth, containerHeight) {
    if (!this.program || !this.texture) {
      console.warn("WebGL shader not properly initialized");
      return;
    }
    this.gl.useProgram(this.program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
    this.setRectangle(0, 0, containerWidth, containerHeight);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.texcoord);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      this.gl.STATIC_DRAW
    );
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      bloomContainer
    );
    this.gl.enableVertexAttribArray(this.locations.position);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
    this.gl.vertexAttribPointer(this.locations.position, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(this.locations.texcoord);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.texcoord);
    this.gl.vertexAttribPointer(this.locations.texcoord, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.uniform2f(this.locations.resolution, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.uniform1i(this.locations.image, 0);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    this.gl.disableVertexAttribArray(this.locations.position);
    this.gl.disableVertexAttribArray(this.locations.texcoord);
    this.gl.disable(this.gl.BLEND);
  }
  dispose() {
    if (this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
    if (this.buffers.position) {
      this.gl.deleteBuffer(this.buffers.position);
      this.buffers.position = null;
    }
    if (this.buffers.texcoord) {
      this.gl.deleteBuffer(this.buffers.texcoord);
      this.buffers.texcoord = null;
    }
    if (this.texture) {
      this.gl.deleteTexture(this.texture);
      this.texture = null;
    }
  }
};

// src/modules/react-threejs/threejs/graphics/canvas-manager.ts
var THREE3 = __toESM(require("three"));

// src/modules/react-threejs/lib/bloom-effect/CameraSync.ts
var THREE2 = __toESM(require("three"));

// src/modules/react-threejs/lib/bloom-effect/Utils.js
var THREE = __toESM(require("three"));

// src/modules/react-threejs/lib/bloom-effect/constants.ts
var WORLD_SIZE = 1024e3;
var FOV_ORTHO = 0.1 / 180 * Math.PI;
var FOV = Math.atan(3 / 4);
var EARTH_RADIUS = 63710088e-1;
var EARTH_CIRCUMFERENCE_EQUATOR = 40075017;
var constants_default = {
  WORLD_SIZE,
  PROJECTION_WORLD_SIZE: WORLD_SIZE / (EARTH_RADIUS * Math.PI * 2),
  MERCATOR_A: EARTH_RADIUS,
  DEG2RAD: Math.PI / 180,
  RAD2DEG: 180 / Math.PI,
  EARTH_RADIUS,
  EARTH_CIRCUMFERENCE: 2 * Math.PI * EARTH_RADIUS,
  //40075000, // In meters
  EARTH_CIRCUMFERENCE_EQUATOR,
  FOV_ORTHO,
  // closest to 0
  FOV,
  // Math.atan(3/4) radians. If this value is changed, FOV_DEGREES must be calculated
  FOV_DEGREES: FOV * 180 / Math.PI,
  // Math.atan(3/4) in degrees
  TILE_SIZE: 512
};

// src/modules/react-threejs/lib/bloom-effect/Utils.js
var utils = {
  prettyPrintMatrix: function(uglymatrix) {
    for (var s = 0; s < 4; s++) {
      var quartet = [
        uglymatrix[s],
        uglymatrix[s + 4],
        uglymatrix[s + 8],
        uglymatrix[s + 12]
      ];
      console.log(
        quartet.map(function(num) {
          return num.toFixed(4);
        })
      );
    }
  },
  makePerspectiveMatrix: function(fovy, aspect, near, far) {
    var out = new THREE.Matrix4();
    var f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    var newMatrix = [
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (far + near) * nf,
      -1,
      0,
      0,
      2 * far * near * nf,
      0
    ];
    out.elements = newMatrix;
    return out;
  },
  //[jscastro] new orthographic matrix calculations https://en.wikipedia.org/wiki/Orthographic_projection and validated with https://bit.ly/3rPvB9Y
  makeOrthographicMatrix: function(left, right, top, bottom, near, far) {
    var out = new THREE.Matrix4();
    const w = 1 / (right - left);
    const h = 1 / (top - bottom);
    const p = 1 / (far - near);
    const x = (right + left) * w;
    const y = (top + bottom) * h;
    const z = near * p;
    var newMatrix = [
      2 * w,
      0,
      0,
      0,
      0,
      2 * h,
      0,
      0,
      0,
      0,
      -1 * p,
      0,
      -x,
      -y,
      -z,
      1
    ];
    out.elements = newMatrix;
    return out;
  },
  //gimme radians
  radify: function(deg) {
    function convert(degrees) {
      degrees = degrees || 0;
      return Math.PI * 2 * degrees / 360;
    }
    if (typeof deg === "object") {
      if (deg.length > 0) {
        return deg.map(function(degree) {
          return convert(degree);
        });
      } else {
        return [convert(deg.x), convert(deg.y), convert(deg.z)];
      }
    } else return convert(deg);
  },
  //gimme degrees
  degreeify: function(rad) {
    function convert(radians) {
      radians = radians || 0;
      return radians * 360 / (Math.PI * 2);
    }
    if (typeof rad === "object") {
      return [convert(rad.x), convert(rad.y), convert(rad.z)];
    } else return convert(rad);
  },
  projectToWorld: function(coords) {
    var projected = [
      -constants_default.MERCATOR_A * constants_default.DEG2RAD * coords[0] * constants_default.PROJECTION_WORLD_SIZE,
      -constants_default.MERCATOR_A * Math.log(
        Math.tan(
          Math.PI * 0.25 + 0.5 * constants_default.DEG2RAD * coords[1]
        )
      ) * constants_default.PROJECTION_WORLD_SIZE
    ];
    if (!coords[2]) projected.push(0);
    else {
      var pixelsPerMeter = this.projectedUnitsPerMeter(coords[1]);
      projected.push(coords[2] * pixelsPerMeter);
    }
    var result = new THREE.Vector3(
      projected[0],
      projected[1],
      projected[2]
    );
    return result;
  },
  projectedUnitsPerMeter: function(latitude) {
    return Math.abs(
      constants_default.WORLD_SIZE / Math.cos(constants_default.DEG2RAD * latitude) / constants_default.EARTH_CIRCUMFERENCE
    );
  },
  _circumferenceAtLatitude: function(latitude) {
    return constants_default.EARTH_CIRCUMFERENCE * Math.cos(latitude * Math.PI / 180);
  },
  mercatorZfromAltitude: function(altitude, lat) {
    return altitude / this._circumferenceAtLatitude(lat);
  },
  _scaleVerticesToMeters: function(centerLatLng, vertices) {
    var pixelsPerMeter = this.projectedUnitsPerMeter(centerLatLng[1]);
    var centerProjected = this.projectToWorld(centerLatLng);
    for (var i = 0; i < vertices.length; i++) {
      vertices[i].multiplyScalar(pixelsPerMeter);
    }
    return vertices;
  },
  projectToScreen: function(coords) {
    console.log(
      "WARNING: Projecting to screen coordinates is not yet implemented"
    );
  },
  unprojectFromScreen: function(pixel) {
    console.log("WARNING: unproject is not yet implemented");
  },
  //world units to lnglat
  unprojectFromWorld: function(worldUnits) {
    var unprojected = [
      -worldUnits.x / (constants_default.MERCATOR_A * constants_default.DEG2RAD * constants_default.PROJECTION_WORLD_SIZE),
      2 * (Math.atan(
        Math.exp(
          worldUnits.y / (constants_default.PROJECTION_WORLD_SIZE * -constants_default.MERCATOR_A)
        )
      ) - Math.PI / 4) / constants_default.DEG2RAD
    ];
    var pixelsPerMeter = this.projectedUnitsPerMeter(unprojected[1]);
    var height = worldUnits.z || 0;
    unprojected.push(height / pixelsPerMeter);
    return unprojected;
  },
  toScreenPosition: function(obj, camera) {
    var vector = new THREE.Vector3();
    var widthHalf = 0.5 * renderer.context.canvas.width;
    var heightHalf = 0.5 * renderer.context.canvas.height;
    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);
    vector.x = vector.x * widthHalf + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;
    return {
      x: vector.x,
      y: vector.y
    };
  },
  //get the center point of a feature
  getFeatureCenter: function getFeatureCenter(feature, model, level) {
    let center = [];
    let latitude = 0;
    let longitude = 0;
    let height = 0;
    let coordinates = [...feature.geometry.coordinates[0]];
    if (feature.geometry.type === "Point") {
      center = [...coordinates[0]];
    } else {
      if (feature.geometry.type === "MultiPolygon")
        coordinates = coordinates[0];
      coordinates.splice(-1, 1);
      coordinates.forEach(function(c) {
        latitude += c[0];
        longitude += c[1];
      });
      center = [
        latitude / coordinates.length,
        longitude / coordinates.length
      ];
    }
    height = this.getObjectHeightOnFloor(feature, model, level);
    center.length < 3 ? center.push(height) : center[2] = height;
    return center;
  },
  getObjectHeightOnFloor: function(feature, obj, level = feature.properties.level || 0) {
    let floorHeightMin = level * (feature.properties.levelHeight || 0);
    let base = feature.properties.base_height || feature.properties.min_height || 0;
    let height = obj && obj.model ? 0 : feature.properties.height - base;
    let objectHeight = height + base;
    let modelHeightFloor = floorHeightMin + objectHeight;
    return modelHeightFloor;
  },
  _flipMaterialSides: function(obj) {
  },
  // to improve precision, normalize a series of vector3's to their collective center, and move the resultant mesh to that center
  normalizeVertices(vertices) {
    let geometry = new THREE.BufferGeometry();
    let positions = [];
    for (var j = 0; j < vertices.length; j++) {
      let p = vertices[j];
      positions.push(p.x, p.y, p.z);
      positions.push(p.x, p.y, p.z);
    }
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(positions), 3)
    );
    geometry.computeBoundingSphere();
    var center = geometry.boundingSphere.center;
    var scaled = vertices.map(function(v3) {
      var normalized = v3.sub(center);
      return normalized;
    });
    return { vertices: scaled, position: center };
  },
  //flatten an array of Vector3's into a shallow array of values in x-y-z order, for bufferGeometry
  flattenVectors(vectors) {
    var flattenedArray = [];
    for (let vertex3 of vectors) {
      flattenedArray.push(vertex3.x, vertex3.y, vertex3.z);
    }
    return flattenedArray;
  },
  //convert a line/polygon to Vector3's
  lnglatsToWorld: function(coords) {
    var vector3 = coords.map(function(pt) {
      var p = utils.projectToWorld(pt);
      var v3 = new THREE.Vector3(p.x, p.y, p.z);
      return v3;
    });
    return vector3;
  },
  extend: function(original, addition) {
    for (let key in addition) original[key] = addition[key];
  },
  clone: function(original) {
    var clone = {};
    for (let key in original) clone[key] = original[key];
    return clone;
  },
  clamp: function(n, min, max) {
    return Math.min(max, Math.max(min, n));
  },
  // retrieve object parameters from an options object
  types: {
    rotation: function(r, currentRotation) {
      if (!r) {
        r = 0;
      }
      if (typeof r === "number") r = { z: r };
      var degrees = this.applyDefault([r.x, r.y, r.z], currentRotation);
      var radians = utils.radify(degrees);
      return radians;
    },
    scale: function(s, currentScale) {
      if (!s) {
        s = 1;
      }
      if (typeof s === "number") return s = [s, s, s];
      else return this.applyDefault([s.x, s.y, s.z], currentScale);
    },
    applyDefault: function(array, current) {
      var output = array.map(function(item, index) {
        item = item || current[index];
        return item;
      });
      return output;
    }
  },
  toDecimal: function(n, d) {
    return Number(n.toFixed(d));
  },
  equal: function(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    if (keys1.length == 0 && keys2.length == 0 && keys1 !== keys2) {
      return false;
    }
    for (const key of keys1) {
      const val1 = obj1[key];
      const val2 = obj2[key];
      const areObjects = this.isObject(val1) && this.isObject(val2);
      if (areObjects && !equal(val1, val2) || !areObjects && val1 !== val2) {
        return false;
      }
    }
    return true;
  },
  isObject: function(object) {
    return object != null && typeof object === "object";
  },
  curveToLine: (curve, params) => {
    let { width, color } = params;
    let geometry = new THREE.BufferGeometry().setFromPoints(
      curve.getPoints(100)
    );
    let material = new THREE.LineBasicMaterial({
      color,
      linewidth: width
    });
    let line = new THREE.Line(geometry, material);
    return line;
  },
  curvesToLines: (curves) => {
    var colors = [16711680, 2031360, 2490623];
    var lines = curves.map((curve, i) => {
      let params = {
        width: 3,
        color: colors[i] || "purple"
      };
      let curveline = curveToLine(curve, params);
      return curveline;
    });
    return lines;
  },
  _validate: function(userInputs, defaults) {
    userInputs = userInputs || {};
    var validatedOutput = {};
    utils.extend(validatedOutput, userInputs);
    for (let key of Object.keys(defaults)) {
      if (userInputs[key] === void 0) {
        if (defaults[key] === null) {
          console.error(key + " is required");
          return;
        } else validatedOutput[key] = defaults[key];
      } else validatedOutput[key] = userInputs[key];
    }
    return validatedOutput;
  },
  // Validator: new validate(),
  exposedMethods: [
    "projectToWorld",
    "projectedUnitsPerMeter",
    "extend",
    "unprojectFromWorld"
  ]
};
var Utils_default = utils;

// src/modules/react-threejs/lib/bloom-effect/CameraSync.ts
var CameraSync = class _CameraSync {
  map;
  camera;
  active;
  world;
  state;
  halfFov;
  cameraToCenterDistance;
  acuteAngle;
  cameraTranslateZ;
  constructor(map, camera, world) {
    this.map = map;
    this.camera = camera;
    this.active = true;
    this.camera.matrixAutoUpdate = false;
    this.world = world || new THREE2.Group();
    this.world.position.x = this.world.position.y = constants_default.WORLD_SIZE / 2;
    this.world.matrixAutoUpdate = false;
    this.state = {
      translateCenter: new THREE2.Matrix4().makeTranslation(
        constants_default.WORLD_SIZE / 2,
        -constants_default.WORLD_SIZE / 2,
        0
      ),
      worldSizeRatio: constants_default.TILE_SIZE / constants_default.WORLD_SIZE,
      worldSize: constants_default.TILE_SIZE * this.map.transform.scale
    };
    const _this = this;
    this.map.on("move", function() {
      _this.updateCamera();
    }).on("resize", function() {
      _this.setupCamera();
    });
    this.setupCamera();
  }
  setupCamera() {
    const t = this.map.transform;
    if (this.camera instanceof THREE2.PerspectiveCamera) {
      this.camera.aspect = t.width / t.height;
    }
    this.halfFov = t._fov / 2;
    this.cameraToCenterDistance = 0.5 / Math.tan(this.halfFov) * t.height;
    const maxPitch = t._maxPitch * Math.PI / 180;
    this.acuteAngle = Math.PI / 2 - maxPitch;
    this.updateCamera();
  }
  updateCamera(ev) {
    if (!this.camera) {
      console.log("nocamera");
      return;
    }
    const t = this.map.transform;
    if (this.camera instanceof THREE2.PerspectiveCamera) {
      this.camera.aspect = t.width / t.height;
    }
    const offset = t.centerOffset || new THREE2.Vector3();
    let farZ = 0;
    let furthestDistance = 0;
    this.halfFov = t._fov / 2;
    const groundAngle = Math.PI / 2 + t._pitch;
    const pitchAngle = Math.cos(Math.PI / 2 - t._pitch);
    this.cameraToCenterDistance = 0.5 / Math.tan(this.halfFov) * t.height;
    let pixelsPerMeter = 1;
    const worldSize = this.worldSize();
    var versionParts = this.map.version.split(".");
    var majorVersion = parseInt(versionParts[0]);
    if (majorVersion >= 2) {
      pixelsPerMeter = this.mercatorZfromAltitude(1, t.center.lat) * worldSize;
      const fovAboveCenter = t._fov * (0.5 + t.centerOffset.y / t.height);
      const minElevationInPixels = t.elevation ? t.elevation.getMinElevationBelowMSL() * pixelsPerMeter : 0;
      const cameraToSeaLevelDistance = (t._camera.position[2] * worldSize - minElevationInPixels) / Math.cos(t._pitch);
      const topHalfSurfaceDistance = Math.sin(fovAboveCenter) * cameraToSeaLevelDistance / Math.sin(Utils_default.clamp(Math.PI - groundAngle - fovAboveCenter, 0.01, Math.PI - 0.01));
      furthestDistance = pitchAngle * topHalfSurfaceDistance + cameraToSeaLevelDistance;
      const horizonDistance = cameraToSeaLevelDistance * (1 / t._horizonShift);
      farZ = Math.min(furthestDistance * 1.01, horizonDistance);
    } else {
      const topHalfSurfaceDistance = Math.sin(this.halfFov) * this.cameraToCenterDistance / Math.sin(Math.PI - groundAngle - this.halfFov);
      furthestDistance = pitchAngle * topHalfSurfaceDistance + this.cameraToCenterDistance;
      farZ = furthestDistance * 1.01;
    }
    this.cameraTranslateZ = new THREE2.Matrix4().makeTranslation(0, 0, this.cameraToCenterDistance);
    const nz = t.height / 50;
    const nearZ = Math.max(nz * pitchAngle, nz);
    const h = t.height;
    const w = t.width;
    if (this.camera instanceof THREE2.OrthographicCamera) {
      this.camera.projectionMatrix = Utils_default.makeOrthographicMatrix(w / -2, w / 2, h / 2, h / -2, nearZ, farZ);
    } else {
      this.camera.projectionMatrix = Utils_default.makePerspectiveMatrix(t._fov, w / h, nearZ, farZ);
    }
    this.camera.projectionMatrix.elements[8] = -offset.x * 2 / t.width;
    this.camera.projectionMatrix.elements[9] = offset.y * 2 / t.height;
    let cameraWorldMatrix = this.calcCameraMatrix(t._pitch, t.angle);
    if (t.elevation) cameraWorldMatrix.elements[14] = t._camera.position[2] * worldSize;
    this.camera.matrixWorld.copy(cameraWorldMatrix);
    let zoomPow = t.scale * this.state.worldSizeRatio;
    let scale = new THREE2.Matrix4();
    let translateMap = new THREE2.Matrix4();
    let rotateMap = new THREE2.Matrix4();
    scale.makeScale(zoomPow, zoomPow, zoomPow);
    let x = t.x || t.point.x;
    let y = t.y || t.point.y;
    translateMap.makeTranslation(-x, y, 0);
    rotateMap.makeRotationZ(Math.PI);
    this.world.matrix = new THREE2.Matrix4().premultiply(rotateMap).premultiply(this.state.translateCenter).premultiply(scale).premultiply(translateMap);
    this.map.fire("CameraSynced", {
      detail: {
        nearZ,
        farZ,
        pitch: t._pitch,
        angle: t.angle,
        furthestDistance,
        cameraToCenterDistance: this.cameraToCenterDistance,
        t: this.map.transform,
        tbProjMatrix: this.camera.projectionMatrix.elements,
        tbWorldMatrix: this.world.matrix.elements,
        cameraSyn: _CameraSync
      }
    });
  }
  worldSize() {
    let t = this.map.transform;
    return t.tileSize * t.scale;
  }
  worldSizeFromZoom() {
    let t = this.map.transform;
    return Math.pow(2, t.zoom) * t.tileSize;
  }
  mercatorZfromAltitude(altitude, lat) {
    return altitude / this.circumferenceAtLatitude(lat);
  }
  mercatorZfromZoom() {
    return this.cameraToCenterDistance / this.worldSizeFromZoom();
  }
  circumferenceAtLatitude(latitude) {
    return constants_default.EARTH_CIRCUMFERENCE * Math.cos(latitude * Math.PI / 180);
  }
  calcCameraMatrix(pitch, angle, trz) {
    const t = this.map.transform;
    const _pitch = pitch === void 0 ? t._pitch : pitch;
    const _angle = angle === void 0 ? t.angle : angle;
    const _trz = trz === void 0 ? this.cameraTranslateZ : trz;
    return new THREE2.Matrix4().premultiply(_trz).premultiply(new THREE2.Matrix4().makeRotationX(_pitch)).premultiply(new THREE2.Matrix4().makeRotationZ(_angle));
  }
  updateCameraState() {
    let t = this.map.transform;
    if (!t.height) return;
    const dir = t._camera.forward();
    const distance = t.cameraToCenterDistance;
    const center = t.point;
    const zoom = t._cameraZoom ? t._cameraZoom : t._zoom;
    const altitude = this.mercatorZfromZoom();
    const height = altitude - this.mercatorZfromAltitude(t._centerAltitude, t.center.lat);
    const updatedWorldSize = t.cameraToCenterDistance / height;
    return [
      center.x / this.worldSize() - dir[0] * distance / updatedWorldSize,
      center.y / this.worldSize() - dir[1] * distance / updatedWorldSize,
      this.mercatorZfromAltitude(t._centerAltitude, t._center.lat) + -dir[2] * distance / updatedWorldSize
    ];
  }
  getWorldToCamera(worldSize, pixelsPerMeter) {
    let t = this.map.transform;
    const matrix = new THREE2.Matrix4();
    const matrixT = new THREE2.Matrix4();
    const o = t._camera._orientation;
    const p = t._camera.position;
    const invPosition = new THREE2.Vector3(p[0], p[1], p[2]);
    const quat = new THREE2.Quaternion();
    quat.set(o[0], o[1], o[2], o[3]);
    const invOrientation = quat.conjugate();
    invPosition.multiplyScalar(-worldSize);
    matrixT.makeTranslation(invPosition.x, invPosition.y, invPosition.z);
    matrix.makeRotationFromQuaternion(invOrientation).premultiply(matrixT);
    matrix.elements[1] *= -1;
    matrix.elements[5] *= -1;
    matrix.elements[9] *= -1;
    matrix.elements[13] *= -1;
    matrix.elements[8] *= pixelsPerMeter;
    matrix.elements[9] *= pixelsPerMeter;
    matrix.elements[10] *= pixelsPerMeter;
    matrix.elements[11] *= pixelsPerMeter;
    return matrix;
  }
  translate(out, a, v) {
    let x = Array.isArray(v) ? v[0] : v.x, y = Array.isArray(v) ? v[1] : v.y, z = Array.isArray(v) ? v[2] : v.z;
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;
    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }
    return out;
  }
};
var CameraSync_default = CameraSync;

// src/modules/react-threejs/threejs/graphics/canvas-manager.ts
var CanvasManager = class {
  _scene;
  _camera;
  _renderer;
  _group;
  _light;
  get scene() {
    return this._scene;
  }
  get camera() {
    return this._camera;
  }
  get renderer() {
    return this._renderer;
  }
  get group() {
    return this._group;
  }
  get light() {
    return this._light;
  }
  constructor(map, container) {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (Object.getOwnPropertyDescriptor(map, "version") === void 0) {
      Object.defineProperty(map, "version", { get: function() {
        return "1.0";
      } });
    }
    const renderer2 = new THREE3.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: container
    });
    renderer2.setPixelRatio(window.devicePixelRatio);
    renderer2.shadowMap.enabled = true;
    renderer2.autoClear = false;
    renderer2.toneMapping = THREE3.ReinhardToneMapping;
    renderer2.setClearAlpha(0);
    const camera = new THREE3.PerspectiveCamera(map.transform.fov, w / h, 0.1, 1e21);
    const scene = new THREE3.Scene();
    const group = new THREE3.Group();
    const light = new THREE3.AmbientLight(13421772);
    scene.add(group);
    scene.add(light);
    new CameraSync_default(map, camera, group);
    this._scene = scene;
    this._camera = camera;
    this._renderer = renderer2;
    this._group = group;
    this._light = light;
  }
  render() {
    if (!this._scene || !this._camera || !this._renderer || !this._group) return;
    const now = performance.now() * 1e-3;
    this._updateAnimatedMaterials(now);
    this._renderer.resetState();
    this._renderer.render(this._scene, this._camera);
  }
  resize(width, height) {
    if (!this._camera || !this._renderer) return;
    this._camera.aspect = width / height;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(width, height);
  }
  dispose() {
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
  _updateAnimatedMaterials(time) {
    if (!this._group) return;
    this._group.traverse((obj) => {
      if (obj.material && obj.material.time !== void 0) {
        obj.material.time = time;
      }
    });
  }
};

// src/modules/react-threejs/threejs/graphics/bloom-renderer.ts
var THREE7 = __toESM(require("three"));
var import_EffectComposer = require("three/addons/postprocessing/EffectComposer.js");
var import_RenderPass = require("three/addons/postprocessing/RenderPass.js");
var import_OutputPass = require("three/addons/postprocessing/OutputPass.js");

// src/modules/react-threejs/lib/bloom-effect/postprocessing/UnrealBloomPass.js
var import_three = require("three");
var import_Pass = require("three/examples/jsm/postprocessing/Pass.js");
var import_CopyShader = require("three/examples/jsm/shaders/CopyShader.js");
var import_LuminosityHighPassShader = require("three/examples/jsm/shaders/LuminosityHighPassShader.js");
var UnrealBloomPass = class _UnrealBloomPass extends import_Pass.Pass {
  constructor(resolution, strength, radius, threshold) {
    super();
    this.strength = strength !== void 0 ? strength : 1;
    this.radius = radius;
    this.threshold = threshold;
    this.resolution = resolution !== void 0 ? new import_three.Vector2(resolution.x, resolution.y) : new import_three.Vector2(256, 256);
    this.clearColor = new import_three.Color(1, 1, 1);
    this.renderTargetsHorizontal = [];
    this.renderTargetsVertical = [];
    this.nMips = 5;
    let resx = Math.round(this.resolution.x / 2);
    let resy = Math.round(this.resolution.y / 2);
    this.renderTargetBright = new import_three.WebGLRenderTarget(resx, resy, { type: import_three.HalfFloatType });
    this.renderTargetBright.texture.name = "UnrealBloomPass.bright";
    this.renderTargetBright.texture.generateMipmaps = false;
    for (let i = 0; i < this.nMips; i++) {
      const renderTargetHorizonal = new import_three.WebGLRenderTarget(resx, resy, { type: import_three.HalfFloatType });
      renderTargetHorizonal.texture.name = "UnrealBloomPass.h" + i;
      renderTargetHorizonal.texture.generateMipmaps = false;
      this.renderTargetsHorizontal.push(renderTargetHorizonal);
      const renderTargetVertical = new import_three.WebGLRenderTarget(resx, resy, { type: import_three.HalfFloatType });
      renderTargetVertical.texture.name = "UnrealBloomPass.v" + i;
      renderTargetVertical.texture.generateMipmaps = false;
      this.renderTargetsVertical.push(renderTargetVertical);
      resx = Math.round(resx / 2);
      resy = Math.round(resy / 2);
    }
    const highPassShader = import_LuminosityHighPassShader.LuminosityHighPassShader;
    this.highPassUniforms = import_three.UniformsUtils.clone(highPassShader.uniforms);
    this.highPassUniforms["luminosityThreshold"].value = threshold;
    this.highPassUniforms["smoothWidth"].value = 0.01;
    this.materialHighPassFilter = new import_three.ShaderMaterial({
      uniforms: this.highPassUniforms,
      vertexShader: highPassShader.vertexShader,
      fragmentShader: highPassShader.fragmentShader
    });
    this.separableBlurMaterials = [];
    const kernelSizeArray = [3, 5, 7, 9, 11];
    resx = Math.round(this.resolution.x / 2);
    resy = Math.round(this.resolution.y / 2);
    for (let i = 0; i < this.nMips; i++) {
      this.separableBlurMaterials.push(this.getSeperableBlurMaterial(kernelSizeArray[i]));
      this.separableBlurMaterials[i].uniforms["invSize"].value = new import_three.Vector2(1 / resx, 1 / resy);
      resx = Math.round(resx / 2);
      resy = Math.round(resy / 2);
    }
    this.compositeMaterial = this.getCompositeMaterial(this.nMips);
    this.compositeMaterial.uniforms["blurTexture1"].value = this.renderTargetsVertical[0].texture;
    this.compositeMaterial.uniforms["blurTexture2"].value = this.renderTargetsVertical[1].texture;
    this.compositeMaterial.uniforms["blurTexture3"].value = this.renderTargetsVertical[2].texture;
    this.compositeMaterial.uniforms["blurTexture4"].value = this.renderTargetsVertical[3].texture;
    this.compositeMaterial.uniforms["blurTexture5"].value = this.renderTargetsVertical[4].texture;
    this.compositeMaterial.uniforms["bloomStrength"].value = strength;
    this.compositeMaterial.uniforms["bloomRadius"].value = 0.1;
    const bloomFactors = [1, 0.8, 0.6, 0.4, 0.2];
    this.compositeMaterial.uniforms["bloomFactors"].value = bloomFactors;
    this.bloomTintColors = [new import_three.Vector3(1, 1, 1), new import_three.Vector3(1, 1, 1), new import_three.Vector3(1, 1, 1), new import_three.Vector3(1, 1, 1), new import_three.Vector3(1, 1, 1)];
    this.compositeMaterial.uniforms["bloomTintColors"].value = this.bloomTintColors;
    const copyShader = import_CopyShader.CopyShader;
    this.copyUniforms = import_three.UniformsUtils.clone(copyShader.uniforms);
    this.blendMaterial = new import_three.ShaderMaterial({
      uniforms: this.copyUniforms,
      vertexShader: copyShader.vertexShader,
      fragmentShader: copyShader.fragmentShader,
      blending: import_three.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      transparent: true
    });
    this.enabled = true;
    this.needsSwap = false;
    this._oldClearColor = new import_three.Color();
    this.oldClearAlpha = 1;
    this.basic = new import_three.MeshBasicMaterial();
    this.fsQuad = new import_Pass.FullScreenQuad(null);
  }
  dispose() {
    for (let i = 0; i < this.renderTargetsHorizontal.length; i++) {
      this.renderTargetsHorizontal[i].dispose();
    }
    for (let i = 0; i < this.renderTargetsVertical.length; i++) {
      this.renderTargetsVertical[i].dispose();
    }
    this.renderTargetBright.dispose();
    for (let i = 0; i < this.separableBlurMaterials.length; i++) {
      this.separableBlurMaterials[i].dispose();
    }
    this.compositeMaterial.dispose();
    this.blendMaterial.dispose();
    this.basic.dispose();
    this.fsQuad.dispose();
  }
  setSize(width, height) {
    let resx = Math.round(width / 2);
    let resy = Math.round(height / 2);
    this.renderTargetBright.setSize(resx, resy);
    for (let i = 0; i < this.nMips; i++) {
      this.renderTargetsHorizontal[i].setSize(resx, resy);
      this.renderTargetsVertical[i].setSize(resx, resy);
      this.separableBlurMaterials[i].uniforms["invSize"].value = new import_three.Vector2(1 / resx, 1 / resy);
      resx = Math.round(resx / 2);
      resy = Math.round(resy / 2);
    }
  }
  render(renderer2, writeBuffer, readBuffer, deltaTime, maskActive) {
    renderer2.getClearColor(this._oldClearColor);
    this.oldClearAlpha = renderer2.getClearAlpha();
    const oldAutoClear = renderer2.autoClear;
    renderer2.autoClear = false;
    renderer2.setClearColor(this.clearColor, 0);
    if (maskActive) renderer2.state.buffers.stencil.setTest(false);
    if (this.renderToScreen) {
      this.fsQuad.material = this.basic;
      this.basic.map = readBuffer.texture;
      renderer2.setRenderTarget(null);
      renderer2.clear();
      this.fsQuad.render(renderer2);
    }
    this.highPassUniforms["tDiffuse"].value = readBuffer.texture;
    this.highPassUniforms["luminosityThreshold"].value = this.threshold;
    this.fsQuad.material = this.materialHighPassFilter;
    renderer2.setRenderTarget(this.renderTargetBright);
    renderer2.clear();
    this.fsQuad.render(renderer2);
    let inputRenderTarget = this.renderTargetBright;
    for (let i = 0; i < this.nMips; i++) {
      this.fsQuad.material = this.separableBlurMaterials[i];
      this.separableBlurMaterials[i].uniforms["colorTexture"].value = inputRenderTarget.texture;
      this.separableBlurMaterials[i].uniforms["direction"].value = _UnrealBloomPass.BlurDirectionX;
      renderer2.setRenderTarget(this.renderTargetsHorizontal[i]);
      renderer2.clear();
      this.fsQuad.render(renderer2);
      this.separableBlurMaterials[i].uniforms["colorTexture"].value = this.renderTargetsHorizontal[i].texture;
      this.separableBlurMaterials[i].uniforms["direction"].value = _UnrealBloomPass.BlurDirectionY;
      renderer2.setRenderTarget(this.renderTargetsVertical[i]);
      renderer2.clear();
      this.fsQuad.render(renderer2);
      inputRenderTarget = this.renderTargetsVertical[i];
    }
    this.fsQuad.material = this.compositeMaterial;
    this.compositeMaterial.uniforms["bloomStrength"].value = this.strength;
    this.compositeMaterial.uniforms["bloomRadius"].value = this.radius;
    this.compositeMaterial.uniforms["bloomTintColors"].value = this.bloomTintColors;
    renderer2.setRenderTarget(this.renderTargetsHorizontal[0]);
    renderer2.clear();
    this.fsQuad.render(renderer2);
    this.fsQuad.material = this.blendMaterial;
    this.copyUniforms["tDiffuse"].value = this.renderTargetsHorizontal[0].texture;
    if (maskActive) renderer2.state.buffers.stencil.setTest(true);
    if (this.renderToScreen) {
      renderer2.setRenderTarget(null);
      this.fsQuad.render(renderer2);
    } else {
      renderer2.setRenderTarget(readBuffer);
      this.fsQuad.render(renderer2);
    }
    renderer2.setClearColor(this._oldClearColor, this.oldClearAlpha);
    renderer2.autoClear = oldAutoClear;
  }
  getSeperableBlurMaterial(kernelRadius) {
    const coefficients = [];
    for (let i = 0; i < kernelRadius; i++) {
      coefficients.push(0.39894 * Math.exp(-0.5 * i * i / (kernelRadius * kernelRadius)) / kernelRadius);
    }
    return new import_three.ShaderMaterial({
      defines: {
        "KERNEL_RADIUS": kernelRadius
      },
      uniforms: {
        "colorTexture": { value: null },
        "invSize": { value: new import_three.Vector2(0.5, 0.5) },
        // inverse texture size
        "direction": { value: new import_three.Vector2(0.5, 0.5) },
        "gaussianCoefficients": { value: coefficients }
        // precomputed Gaussian coefficients
      },
      vertexShader: `varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
      fragmentShader: `#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec4 sample1 = texture2D( colorTexture, vUv + uvOffset );
						vec4 sample2 = texture2D( colorTexture, vUv - uvOffset );
						diffuseSum += (sample1.rgb + sample2.rgb) * w;
						weightSum += 2.0 * w;
					}
				
					gl_FragColor = vec4(diffuseSum / weightSum, 1.0);
				}`
    });
  }
  getCompositeMaterial(nMips) {
    return new import_three.ShaderMaterial({
      defines: {
        "NUM_MIPS": nMips
      },
      uniforms: {
        "blurTexture1": { value: null },
        "blurTexture2": { value: null },
        "blurTexture3": { value: null },
        "blurTexture4": { value: null },
        "blurTexture5": { value: null },
        "bloomStrength": { value: 1 },
        "bloomFactors": { value: null },
        "bloomTintColors": { value: null },
        "bloomRadius": { value: 0 }
      },
      vertexShader: `varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
      fragmentShader: `varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`
    });
  }
};
UnrealBloomPass.BlurDirectionX = new import_three.Vector2(1, 0);
UnrealBloomPass.BlurDirectionY = new import_three.Vector2(0, 1);

// src/modules/react-threejs/threejs/objects/mix-pass/mix-pass-material.ts
var THREE6 = __toESM(require("three"));

// src/modules/react-threejs/threejs/shaders/shader-lib.ts
var THREE5 = require("three");

// src/modules/react-threejs/threejs/shaders/uniforms-lib.ts
var THREE4 = __toESM(require("three"));
var UniformsLib = {
  mixPass: {
    baseTexture: { value: null },
    bloomTexture: { value: null }
  },
  extrudeWall: {
    colorA: { value: new THREE4.Color(49151) },
    colorB: { value: new THREE4.Color(13158) },
    wallOpacity: { value: 0.1 },
    stripeCount: { value: 2 },
    speed: { value: 0.5 },
    time: { value: 0 }
    // Time uniform for animation (start at 0)
  }
};

// src/modules/react-threejs/threejs/shaders/shader-chunk/mix-pass.ts
var vertex = (
  /* glsl */
  `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`
);
var fragment = (
  /* glsl */
  `
uniform sampler2D baseTexture;
uniform sampler2D bloomTexture;
varying vec2 vUv;

void main() {
  // Combine base texture and bloom texture
  vec4 base_color = texture2D(baseTexture, vUv);
  vec4 bloom_color = texture2D(bloomTexture, vUv);
  vec3 blendedColor = base_color.rgb + bloom_color.rgb;
  gl_FragColor = vec4(blendedColor, 1.0);
}
`
);

// src/modules/react-threejs/threejs/shaders/shader-chunk/extrude-wall.ts
var vertex2 = (
  /* glsl */
  `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`
);
var fragment2 = (
  /* glsl */
  `
uniform vec3 colorA;
uniform vec3 colorB;
uniform float wallOpacity;
uniform float stripeCount;
uniform float time;
uniform float speed;
varying vec2 vUv;

void main() {
  // Invert UV.y so stripes animate from bottom to top
  float t = (1.0 - vUv.y) * stripeCount + time * speed;
  float band = fract(t);
  
  // Feather both ends using smoothstep
  float feather = 0.35;
  float edge = smoothstep(0.0, feather, band) * (1.0 - smoothstep(1.0 - feather, 1.0, band));
  vec3 color = mix(colorA, colorB, edge);
  gl_FragColor = vec4(color, wallOpacity);
}
`
);

// src/modules/react-threejs/threejs/shaders/shader-chunk.ts
var ShaderChunk = {
  mixPass_vert: vertex,
  mixPass_frag: fragment,
  extrudeWall_vert: vertex2,
  extrudeWall_frag: fragment2
};

// src/modules/react-threejs/threejs/shaders/shader-lib.ts
var ShaderLib = {
  mixPass: {
    uniforms: UniformsLib.mixPass,
    vertexShader: ShaderChunk.mixPass_vert,
    fragmentShader: ShaderChunk.mixPass_frag
  },
  extrudeWall: {
    uniforms: UniformsLib.extrudeWall,
    vertexShader: ShaderChunk.extrudeWall_vert,
    fragmentShader: ShaderChunk.extrudeWall_frag
  }
};

// src/modules/react-threejs/threejs/objects/mix-pass/mix-pass-material.ts
var MixPassMaterial = class extends THREE6.ShaderMaterial {
  isMixPassMaterial;
  type;
  constructor(parameters = {}) {
    super({
      uniforms: THREE6.UniformsUtils.clone(ShaderLib["mixPass"].uniforms),
      vertexShader: ShaderLib["mixPass"].vertexShader,
      fragmentShader: ShaderLib["mixPass"].fragmentShader,
      defines: {}
    });
    this.isMixPassMaterial = true;
    this.type = "MixPassMaterial";
    this.setValues(parameters);
  }
  get baseTexture() {
    return this.uniforms.baseTexture.value;
  }
  set baseTexture(value) {
    this.uniforms.baseTexture.value = value;
  }
  get bloomTexture() {
    return this.uniforms.bloomTexture.value;
  }
  set bloomTexture(value) {
    this.uniforms.bloomTexture.value = value;
  }
};

// src/modules/react-threejs/threejs/objects/mix-pass/mix-pass.ts
var import_ShaderPass = require("three/addons/postprocessing/ShaderPass.js");
var MixPass = class extends import_ShaderPass.ShaderPass {
  isMixPass;
  type;
  constructor(material = new MixPassMaterial()) {
    super(material);
    this.isMixPass = true;
    this.type = "MixPass";
    this.textureID = "baseTexture";
    this.needsSwap = true;
  }
};

// src/modules/react-threejs/threejs/graphics/bloom-renderer.ts
var BloomRenderer = class {
  // Layer for bloom effect
  constructor(_renderer, _scene, _camera) {
    this._renderer = _renderer;
    this._scene = _scene;
    this._camera = _camera;
    this._bloomLayer = new THREE7.Layers();
    this._bloomLayer.set(this.bloomScene);
    this._darkMaterial = new THREE7.MeshBasicMaterial({ color: "black" });
    const renderScene = new import_RenderPass.RenderPass(this._scene, this._camera);
    const bloomPass = new UnrealBloomPass();
    bloomPass.resolution = new THREE7.Vector2();
    bloomPass.strength = 0;
    bloomPass.radius = 0;
    bloomPass.threshold = 0;
    const bloomComposer = new import_EffectComposer.EffectComposer(this._renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);
    const mixPassMaterial = new MixPassMaterial();
    mixPassMaterial.bloomTexture = bloomComposer.renderTarget2.texture;
    const mixPass = new MixPass(mixPassMaterial);
    const outputPass = new import_OutputPass.OutputPass();
    const composer = new import_EffectComposer.EffectComposer(this._renderer);
    composer.addPass(renderScene);
    composer.addPass(mixPass);
    composer.addPass(outputPass);
    this._composer = composer;
    this._bloomComposer = bloomComposer;
    this._bloomPass = bloomPass;
  }
  _composer;
  _bloomComposer;
  _bloomPass;
  _bloomLayer;
  _darkMaterial;
  _materials = {};
  bloomScene = 1;
  setResolution(width, height) {
    if (this._bloomPass) {
      this._bloomPass.resolution = new THREE7.Vector2(width, height);
    }
  }
  setValues(effect) {
    if (this._bloomPass && effect) {
      this._bloomPass.strength = effect.strength || 0;
      this._bloomPass.radius = effect.radius || 0;
      this._bloomPass.threshold = effect.threshold || 0;
    }
  }
  render() {
    if (!this._bloomComposer || !this._composer) return;
    this._scene.traverse(this._darkenNonBloomed.bind(this));
    this._scene.traverse(this._restoreMaterial.bind(this));
    this._bloomComposer.render();
    this._composer.render();
  }
  resize(width, height) {
    if (!this._bloomComposer || !this._composer) return;
    this._composer.setSize(width, height);
    this._bloomComposer.setSize(width, height);
  }
  enableBloom(object) {
    object.layers.enable(this.bloomScene);
  }
  disableBloom(object) {
    object.layers.disable(this.bloomScene);
  }
  dispose() {
    if (this._bloomComposer) {
      this._bloomComposer.dispose();
    }
    if (this._composer) {
      this._composer.dispose();
    }
    this._materials = {};
  }
  _darkenNonBloomed(obj) {
    const mesh = obj;
    if (mesh.isMesh && !this._bloomLayer?.test(obj.layers) && this._darkMaterial) {
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(() => this._darkMaterial) : this._darkMaterial;
      this._materials[obj.uuid] = mesh.material;
    }
  }
  _restoreMaterial(obj) {
    const mesh = obj;
    if (this._materials[obj.uuid]) {
      mesh.material = this._materials[obj.uuid];
      delete this._materials[obj.uuid];
    }
  }
};

// src/modules/react-threejs/threejs/graphics/effect-manager.ts
var EffectManager = class {
  _canvasContext = null;
  _canvasContainer = null;
  _canvasManager = null;
  _bloomRenderer = null;
  _shaderManager = null;
  _map = null;
  _mapResizing = null;
  props;
  get context() {
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
      container: this._canvasContainer
    };
  }
  constructor(props, map) {
    this.props = props;
    if (map) {
      this._map = map;
      this._initialize(map);
    }
  }
  _initialize(map) {
    map.addLayer({
      id: "effect-layer",
      type: "custom",
      renderingMode: "3d",
      onAdd: this._onAdd.bind(this),
      render: this._render.bind(this),
      onRemove: this._onRemove.bind(this)
    });
  }
  destroy() {
    this._onRemove();
    if (this._map && this._map.style?._loaded && this._map.getLayer("effect-layer")) {
      this._map.removeLayer("effect-layer");
      this._map = null;
    }
  }
  _onAdd(map, gl) {
    const container = map.getCanvas();
    const { clientWidth, clientHeight } = container;
    this._canvasContainer = new CanvasContainer(map);
    this._canvasManager = new CanvasManager(map, this._canvasContainer);
    const { scene, camera, renderer: renderer2, group, light } = this._canvasManager;
    this._bloomRenderer = new BloomRenderer(renderer2, scene, camera);
    this._bloomRenderer.setResolution(clientWidth, clientHeight);
    this._bloomRenderer.setValues(this.props);
    this._shaderManager = new WebGLShaderManager(gl);
    this._canvasContext = { scene, camera, renderer: renderer2, group, light };
    this._setMapResizing();
  }
  _render() {
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
  }
  _onRemove() {
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
  _handleMapResizing() {
    if (!this._map) return;
    const mapCanvas = this._map.getCanvas();
    const width = mapCanvas.width / window.devicePixelRatio;
    const height = mapCanvas.height / window.devicePixelRatio;
    if (this._canvasContainer) {
      this._canvasContainer.width = width;
      this._canvasContainer.height = height;
      this._canvasContainer.style.width = width + "px";
      this._canvasContainer.style.height = height + "px";
    }
    this._canvasManager?.resize(width, height);
    this._bloomRenderer?.resize(width, height);
  }
  _setMapResizing() {
    const boundResizing = this._handleMapResizing.bind(this);
    window.addEventListener("resize", boundResizing);
    this._map?.on("resize", boundResizing);
    this._mapResizing = boundResizing;
  }
  _removeMapResizing() {
    window.removeEventListener("resize", this._mapResizing);
    this._map?.off("resize", this._mapResizing);
    this._mapResizing = null;
  }
};

// src/modules/react-threejs/components/effect-canvas.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var EffectCanvasContext = React10.createContext(null);
var _EffectCanvas = (props, ref) => {
  const { id, mapId, children, onError, onLoad, ...options } = props;
  const mapRef = (0, import_maplibre4.useMap)();
  const [effectManager, setEffectManager] = React10.useState(null);
  const optionsRef = React10.useRef(options);
  const { current: contextValue } = React10.useRef({});
  const canvasOptions = React10.useMemo(() => options, [Object.values(options).join(",")]);
  React10.useEffect(() => {
    let isMounted = true;
    let effectInstance = null;
    const mapInstance = mapRef?.[mapId || "current"]?.getMap();
    try {
      if (!isMounted) {
        return;
      }
      if (!effectInstance) {
        effectInstance = new EffectManager(canvasOptions, mapInstance);
        const context = effectInstance.context;
        if (context) {
          contextValue.scene = context.scene;
          contextValue.camera = context.camera;
          contextValue.renderer = context.renderer;
          contextValue.group = context.group;
          contextValue.light = context.light;
          contextValue.bloom = context.bloom;
          contextValue.container = context.container;
        }
        onLoad?.();
        setEffectManager(effectInstance);
      }
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      } else {
        console.error(error);
      }
    }
    return () => {
      isMounted = false;
      if (effectInstance) {
        effectInstance.destroy();
      }
    };
  }, []);
  use_isomorphic_layout_effect_default(() => {
    if (effectManager && optionsRef.current) {
      if (!deepEqual(options, optionsRef.current)) {
        effectManager.context?.bloom?.setValues(options);
      }
      optionsRef.current = options;
    }
  }, [options, effectManager]);
  React10.useImperativeHandle(ref, () => contextValue, [effectManager]);
  return effectManager && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(EffectCanvasContext.Provider, { value: contextValue, children });
};
var EffectCanvas = React10.forwardRef(_EffectCanvas);

// src/modules/react-threejs/components/bloom-line.tsx
var React11 = __toESM(require("react"));

// src/modules/react-threejs/threejs/objects/bloom-line/bloom-line-geometry.ts
var THREE9 = __toESM(require("three"));
var import_LineGeometry = require("three/addons/lines/LineGeometry.js");
var BloomLineGeometry = class extends import_LineGeometry.LineGeometry {
  isBloomLineGeometry;
  type;
  processedVertices = [];
  normalizedPosition = new THREE9.Vector3();
  constructor() {
    super();
    this.isBloomLineGeometry = true;
    this.type = "BloomLineGeometry";
  }
  setGeometry(geometry) {
    const straightProject = Utils_default.lnglatsToWorld(geometry);
    const normalized = Utils_default.normalizeVertices(straightProject);
    const flattenedArray = Utils_default.flattenVectors(normalized.vertices);
    this.processedVertices = normalized.vertices;
    this.normalizedPosition = normalized.position;
    this.setPositions(flattenedArray);
  }
};

// src/modules/react-threejs/threejs/objects/bloom-line/bloom-line-material.ts
var import_LineMaterial = require("three/addons/lines/LineMaterial.js");
var BloomLineMaterial = class extends import_LineMaterial.LineMaterial {
  isBloomLineMaterial;
  type;
  constructor(parameters = {}) {
    super({
      color: parameters.color || "white",
      linewidth: parameters.linewidth ?? 1,
      opacity: parameters.opacity ?? 1,
      dashed: false,
      transparent: true,
      depthWrite: false
    });
    this.isBloomLineMaterial = true;
    this.type = "BloomLineMaterial";
    this.setValues(parameters);
  }
};

// src/modules/react-threejs/threejs/objects/bloom-line/bloom-line.ts
var THREE10 = require("three");
var import_Line2 = require("three/addons/lines/Line2.js");
var BloomLine = class extends import_Line2.Line2 {
  isBloomLine;
  type;
  constructor(geometry = new BloomLineGeometry(), material = new BloomLineMaterial({ color: "white" })) {
    super(geometry, material);
    this.isBloomLine = true;
    this.type = "BloomLine";
  }
  setPosition(position) {
    this.position.copy(position);
  }
};

// src/modules/react-threejs/components/bloom-line.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var MeshContext = React11.createContext({ mesh: null });
var _LineMesh = ({ children }) => {
  const { group, bloom } = React11.useContext(EffectCanvasContext) || {};
  const [mesh] = React11.useState(new BloomLine());
  React11.useEffect(() => {
    if (mesh && group && bloom) {
      try {
        group.add(mesh);
        bloom.enableBloom(mesh);
      } catch (error) {
        console.error("Error adding mesh to scene:", error);
      }
    }
    return () => {
      if (mesh && group && bloom) {
        group.remove(mesh);
        bloom.disableBloom(mesh);
      }
    };
  }, [mesh, group, bloom]);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(MeshContext.Provider, { value: { mesh }, children });
};
var _LineGeometry = (props) => {
  const { mesh } = React11.useContext(MeshContext) || {};
  const [geometry] = React11.useState(new BloomLineGeometry());
  const memorizedProps = React11.useMemo(() => props, [props.geometry?.join(",")]);
  React11.useEffect(() => {
    if (mesh && geometry) {
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      try {
        if (!!memorizedProps.geometry?.length) {
          geometry.setGeometry(memorizedProps.geometry);
        }
        mesh.geometry = geometry;
        mesh.setPosition(geometry.normalizedPosition);
      } catch (error) {
        console.error("Error creating BloomLineGeometry:", error);
      }
    }
    return () => {
      if (mesh && geometry && mesh.geometry) {
        mesh.geometry.dispose();
      }
    };
  }, [geometry, memorizedProps, mesh]);
  return null;
};
var _LineMaterial = (props) => {
  const { mesh } = React11.useContext(MeshContext) || {};
  const [material] = React11.useState(new BloomLineMaterial(props));
  const memorizedProps = React11.useMemo(() => props, [Object.values(props).join(",")]);
  React11.useEffect(() => {
    if (mesh && material) {
      if (mesh.material) {
        mesh.material.dispose();
      }
      try {
        material.setValues(memorizedProps);
        mesh.material = material;
      } catch (error) {
        console.error("Error creating BloomLineMaterial:", error);
      }
    }
    return () => {
      if (mesh && material && mesh.material) {
        mesh.material.dispose();
      }
    };
  }, [material, memorizedProps, mesh]);
  return null;
};

// src/modules/react-threejs/components/extrude-wall.tsx
var React12 = __toESM(require("react"));

// src/modules/react-threejs/threejs/objects/extrude-wall/extrude-wall-geometry.ts
var THREE11 = __toESM(require("three"));
var ExtrudeWallGeometry = class extends THREE11.BufferGeometry {
  isExtrudeWallGeometry;
  type;
  offsetPosition = new THREE11.Vector3();
  constructor() {
    super();
    this.isExtrudeWallGeometry = true;
    this.type = "ExtrudeWallGeometry";
  }
  setGeometry(geometry, heightMeters) {
    const straightProject = Utils_default.lnglatsToWorld(geometry);
    const unitHeight = Utils_default.projectedUnitsPerMeter(geometry[0][1]);
    const n = straightProject.length;
    const wallHeight = heightMeters * unitHeight;
    const vertices = [];
    const uvs = [];
    const indices = [];
    const [offsetX, offsetY] = straightProject[0];
    this.offsetPosition.set(offsetX, offsetY, 0);
    for (let i = 0; i < n; i++) {
      const [x, y] = straightProject[i];
      vertices.push(x - offsetX, y - offsetY, 0);
      uvs.push(i / (n - 1), 0);
      vertices.push(x - offsetX, y - offsetY, wallHeight);
      uvs.push(i / (n - 1), 1);
    }
    for (let i = 0; i < n - 1; i++) {
      const base = i * 2;
      indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    }
    this.setAttribute("position", new THREE11.Float32BufferAttribute(vertices, 3));
    this.setAttribute("uv", new THREE11.Float32BufferAttribute(uvs, 2));
    this.setIndex(indices);
    this.computeVertexNormals();
    this.computeBoundingBox();
    this.computeBoundingSphere();
  }
};

// src/modules/react-threejs/threejs/objects/extrude-wall/extrude-wall-material.ts
var THREE12 = __toESM(require("three"));
var ExtrudeWallMaterial = class extends THREE12.ShaderMaterial {
  isExtrudeWallMaterial;
  type;
  constructor(parameters = {}) {
    super({
      uniforms: THREE12.UniformsUtils.clone(ShaderLib["extrudeWall"].uniforms),
      vertexShader: ShaderLib["extrudeWall"].vertexShader,
      fragmentShader: ShaderLib["extrudeWall"].fragmentShader,
      transparent: true,
      side: THREE12.DoubleSide,
      depthWrite: false
    });
    this.isExtrudeWallMaterial = true;
    this.type = "ExtrudeWallMaterial";
    this.setValues(parameters);
  }
  get colorA() {
    return this.uniforms.colorA.value;
  }
  set colorA(value) {
    this.uniforms.colorA.value = value;
  }
  get colorB() {
    return this.uniforms.colorB.value;
  }
  set colorB(value) {
    this.uniforms.colorB.value = value;
  }
  get stripeCount() {
    return this.uniforms.stripeCount.value;
  }
  set stripeCount(value) {
    this.uniforms.stripeCount.value = value;
  }
  get wallOpacity() {
    return this.uniforms.wallOpacity.value;
  }
  set wallOpacity(value) {
    this.uniforms.wallOpacity.value = value;
  }
  get speed() {
    return this.uniforms.speed.value;
  }
  set speed(value) {
    this.uniforms.speed.value = value;
  }
  get time() {
    return this.uniforms.time.value;
  }
  set time(value) {
    this.uniforms.time.value = value;
  }
};

// src/modules/react-threejs/threejs/objects/extrude-wall/extrude-wall.ts
var THREE13 = __toESM(require("three"));
var ExtrudeWall = class extends THREE13.Mesh {
  isExtrudeWall;
  type;
  constructor(geometry = new ExtrudeWallGeometry(), material = new ExtrudeWallMaterial({ colorA: 49151, colorB: 13158 })) {
    super(geometry, material);
    this.isExtrudeWall = true;
    this.type = "ExtrudeWall";
    this.userData.isStripeWall = true;
  }
  setPosition(position) {
    this.position.copy(position);
  }
};

// src/modules/react-threejs/components/extrude-wall.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
var MeshContext2 = React12.createContext({ mesh: null });
var _WallMesh = ({ children }) => {
  const { group, bloom } = React12.useContext(EffectCanvasContext) || {};
  const [mesh] = React12.useState(new ExtrudeWall());
  React12.useEffect(() => {
    if (mesh && group && bloom) {
      try {
        group.add(mesh);
        bloom.enableBloom(mesh);
      } catch (error) {
        console.error("Error adding mesh to scene:", error);
      }
    }
    return () => {
      if (mesh && group && bloom) {
        group.remove(mesh);
        bloom.disableBloom(mesh);
      }
    };
  }, [mesh, group, bloom]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(MeshContext2.Provider, { value: { mesh }, children });
};
var _WallGeometry = (props) => {
  const { mesh } = React12.useContext(MeshContext2) || {};
  const [geometry] = React12.useState(new ExtrudeWallGeometry());
  const memorizedProps = React12.useMemo(() => props, [props.geometry?.join(","), props.height]);
  React12.useEffect(() => {
    if (mesh && geometry) {
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }
      try {
        if (!!memorizedProps.geometry?.length && !!memorizedProps.height) {
          geometry.setGeometry(memorizedProps.geometry, memorizedProps.height);
        }
        mesh.geometry = geometry;
        mesh.setPosition(geometry.offsetPosition);
      } catch (error) {
        console.error("Error creating ExtrudeWallGeometry:", error);
      }
    }
    return () => {
      if (mesh && geometry && mesh.geometry) {
        mesh.geometry.dispose();
      }
    };
  }, [geometry, memorizedProps, mesh]);
  return null;
};
var _WallMaterial = (props) => {
  const { mesh } = React12.useContext(MeshContext2) || {};
  const [material] = React12.useState(new ExtrudeWallMaterial(props));
  const memorizedProps = React12.useMemo(() => props, [Object.values(props).join(",")]);
  React12.useEffect(() => {
    if (mesh && material) {
      if (mesh.material && !Array.isArray(mesh.material)) {
        mesh.material.dispose();
      }
      try {
        material.setValues(memorizedProps);
        mesh.material = material;
      } catch (error) {
        console.error("Error creating ExtrudeWallMaterial:", error);
      }
    }
    return () => {
      if (mesh && material && mesh.material && !Array.isArray(mesh.material)) {
        mesh.material.dispose();
      }
    };
  }, [material, memorizedProps, mesh]);
  return null;
};

// src/modules/react-threejs/types/common.ts
var THREE14 = require("three");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BloomLine,
  BloomLineGeometry,
  BloomLineMaterial,
  CustomLayer,
  EffectCanvas,
  ExtrudeWall,
  ExtrudeWallGeometry,
  ExtrudeWallMaterial,
  ModelBatcher,
  ModelLoader,
  ModelRenderer,
  PopupAnimation,
  Threebox,
  ThreeboxInstance,
  ThreeboxLayer,
  ThreeboxProvider,
  useLineAnimation,
  useThreebox,
  ...require("react-map-gl/maplibre")
});
//# sourceMappingURL=index.js.map