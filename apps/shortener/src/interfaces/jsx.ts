// @ts-nocheck
import FogMaterial from '../materials/FogMaterial';

declare global {
  declare module JSX {
    interface IntrinsicElements {
      customMaterial: ReactThreeFiber.Object3DNode<
        FogMaterial,
        typeof FogMaterial
      >;
    }
  }
}
