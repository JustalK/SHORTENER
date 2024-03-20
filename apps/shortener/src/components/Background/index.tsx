import React, { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import '../../materials/FogMaterial';
import * as THREE from 'three';

export default function Background({
  mouse,
  height,
  width,
}: {
  mouse?: any;
  height?: number;
  width?: number;
}) {
  const { viewport } = useThree();
  const ref = useRef({
    uResolution: new THREE.Vector2(viewport.width, viewport.height),
    uTime: 0,
    uMouse: new THREE.Vector2(0.0, 0.0),
  });

  useFrame((state, delta) => {
    ref.current.uTime += delta;
    if (mouse.current) {
      ref.current.uMouse = mouse.current;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[viewport.width, viewport.height, 32, 32]} />
      <fogMaterial
        ref={ref}
        uResolution={new THREE.Vector2(width / height, width / height)}
      />
    </mesh>
  );
}

/**

*/
