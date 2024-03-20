import * as THREE from 'three';
import FogMaterial from '../materials/FogMaterial';

const getWidthAndHeight = (camera, distance) => {
  const viewFOV = (camera.fov * Math.PI) / 180;
  const height = 2 * Math.tan(viewFOV / 2) * distance;
  const width = height * camera.aspect;
  return [width, height];
};

export const init3D = (canvas: any) => {
  const scene = new THREE.Scene();
  const clock = new THREE.Clock();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const [width, height] = getWidthAndHeight(camera, 100);
  camera.position.z = 100;

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  canvas.current.appendChild(renderer.domElement);

  const geometry = new THREE.PlaneGeometry(width, height);
  const backgroundMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uResolution: {
        value: new THREE.Vector2(1.0, window.innerHeight / window.innerWidth),
      },
      uMouse: { value: new THREE.Vector2(0.0, 0.5) },
      uTime: { value: 0.0 },
    },
    fragmentShader: FogMaterial.fragmentShader(),
    vertexShader: FogMaterial.vertexShader(),
  });
  const background = new THREE.Mesh(geometry, backgroundMaterial);
  background.name = 'background';
  scene.add(background);

  function animate() {
    requestAnimationFrame(animate);

    if (clock.getDelta() > 1 / 60) {
      backgroundMaterial.uniforms.uTime.value = clock.getElapsedTime();

      renderer.render(scene, camera);
    }
  }

  animate();

  return { backgroundMaterial, renderer, camera };
};
