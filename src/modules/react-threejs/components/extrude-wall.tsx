import * as React from 'react';
import { EffectCanvasContext } from './effect-canvas';
import {
  ExtrudeWall,
  ExtrudeWallGeometry,
  ExtrudeWallMaterial,
} from '../threejs/objects/extrude-wall';
import type { 
  ExtrudeWallGeometryParams, 
  ExtrudeWallMaterialParams 
} from '../types/common';

export type MeshContextValue = { mesh: ExtrudeWall | null };
export const MeshContext = React.createContext<MeshContextValue>({ mesh: null });
export type WallMeshProps = React.PropsWithChildren & {};

const _WallMesh: React.FC<WallMeshProps> = ({ children }) => {
  const { group, bloom } = React.useContext(EffectCanvasContext) || {};
  const [mesh] = React.useState(new ExtrudeWall());

  React.useEffect(() => {
    if (mesh && group && bloom) {
      try {
        group.add(mesh);
        bloom.enableBloom(mesh);
      } catch (error) {
        console.error('Error adding mesh to scene:', error);
      }
    }
    return () => {
      if (mesh && group && bloom) {
        group.remove(mesh);
        bloom.disableBloom(mesh);
      }
    };
  }, [mesh, group, bloom]);

  return <MeshContext.Provider value={{ mesh }}>{children}</MeshContext.Provider>;
};

const _WallGeometry: React.FC<ExtrudeWallGeometryParams> = (props) => {
  const { mesh } = React.useContext(MeshContext) || {};
  const [geometry] = React.useState(new ExtrudeWallGeometry());

  const memorizedProps = React.useMemo(() => props, [props.geometry?.join(','), props.height]);

  React.useEffect(() => {
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
        console.error('Error creating ExtrudeWallGeometry:', error);
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

const _WallMaterial: React.FC<ExtrudeWallMaterialParams> = (props) => {
  const { mesh } = React.useContext(MeshContext) || {};
  const [material] = React.useState(new ExtrudeWallMaterial(props));

  const memorizedProps = React.useMemo(() => props, [Object.values(props).join(',')]);

  React.useEffect(() => {
    if (mesh && material) {
      if (mesh.material && !Array.isArray(mesh.material)) {
        mesh.material.dispose();
      }

      try {
        material.setValues(memorizedProps);
        mesh.material = material;
      } catch (error) {
        console.error('Error creating ExtrudeWallMaterial:', error);
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

export {
  _WallMesh as ExtrudeWall,
  _WallGeometry as ExtrudeWallGeometry,
  _WallMaterial as ExtrudeWallMaterial,
};
