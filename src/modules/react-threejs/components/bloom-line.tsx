import * as React from 'react';
import type { BloomLineGeometryParams, BloomLineMaterialParams } from '../types/common';
import { BloomLine, BloomLineGeometry, BloomLineMaterial } from '../threejs/objects/bloom-line';
import { EffectCanvasContext } from './effect-canvas';

export type MeshContextValue = { mesh: BloomLine | null };
export const MeshContext = React.createContext<MeshContextValue>({ mesh: null });
export type LineMeshProps = React.PropsWithChildren & {};

const _LineMesh: React.FC<LineMeshProps> = ({ children }) => {
  const { group, bloom } = React.useContext(EffectCanvasContext) || {};
  const [mesh] = React.useState(new BloomLine());

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

const _LineGeometry: React.FC<BloomLineGeometryParams> = (props) => {
  const { mesh } = React.useContext(MeshContext) || {};
  const [geometry] = React.useState(new BloomLineGeometry());

  const memorizedProps = React.useMemo(() => props, [props.geometry?.join(',')]);

  React.useEffect(() => {
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
        console.error('Error creating BloomLineGeometry:', error);
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

const _LineMaterial: React.FC<BloomLineMaterialParams> = (props) => {
  const { mesh } = React.useContext(MeshContext) || {};
  const [material] = React.useState(new BloomLineMaterial(props));

  const memorizedProps = React.useMemo(() => props, [Object.values(props).join(',')]);

  React.useEffect(() => {
    if (mesh && material) {
      if (mesh.material) {
        mesh.material.dispose();
      }

      try {
        material.setValues(memorizedProps);
        mesh.material = material;
      } catch (error) {
        console.error('Error creating BloomLineMaterial:', error);
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

export {
  _LineMesh as BloomLine,
  _LineGeometry as BloomLineGeometry,
  _LineMaterial as BloomLineMaterial,
};
