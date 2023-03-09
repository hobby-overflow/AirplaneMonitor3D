import React, { useEffect } from 'react';
import * as THREE from 'three';
import { Aircraft } from '../class/Aircraft';

// import SkyPanoramic from '../assets/SkyPanoramic_mini.png';

type Ac3DViewerProps = {
  addAcList: Array<Aircraft>;
  updateAcList: Array<Aircraft>;
  removeAcList: Array<Aircraft>;
};

export function Ac3DViewer(props: Ac3DViewerProps) {
  useEffect(() => {
    init();
  }, []);

  function init() {
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#three') as HTMLCanvasElement,
      antialias: false,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(innerWidth, innerHeight);

    const scene = new THREE.Scene();

    // カメラの定
    const fov = 40;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 5000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 3);
    camera.updateMatrix();

    // ライトの設定
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    scene.add(directionalLight);

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshNormalMaterial();
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    scene.add(box);

    const clock = new THREE.Clock();
    function tick() {
      const targetFps = 60;
      setTimeout(() => {
        requestAnimationFrame(() => tick());
      }, 1000 / targetFps);
      const delta = clock.getDelta()
      box.rotation.y += delta * 0.5
      box.rotation.z += delta * 0.25
      renderer.render(scene, camera);
    }
    tick();
  }

  return (
    <>
      <canvas id="three"></canvas>
      <div id="labelContainer"></div>
    </>
  );
}
