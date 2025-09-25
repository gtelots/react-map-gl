import * as mixPass from './shader-chunk/mix-pass';
import * as extrudeWall from './shader-chunk/extrude-wall';

export const ShaderChunk = {
  mixPass_vert: mixPass.vertex,
  mixPass_frag: mixPass.fragment,
  extrudeWall_vert: extrudeWall.vertex,
  extrudeWall_frag: extrudeWall.fragment,
};
