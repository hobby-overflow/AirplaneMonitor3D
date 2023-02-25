import React, { useEffect } from 'react';
import * as THREE from 'three';

// import SkyPanoramic from '../assets/SkyPanoramic_mini.png';

export function Ac3DViewer() {
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

    function tick() {
      setTimeout(() => {
        requestAnimationFrame(() => tick());
      }, 1000 / 30);
      box.position.x += (1000 / 30) * 0.0001;
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
