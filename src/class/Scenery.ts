import * as THREE from 'three';
import { LngLat } from 'mapbox-gl';
import { Vector3 } from 'three';
import { GeoMath } from './GeoMath';
import { ColladaLoader } from '../lib/ColladaLoader.js';

export class Scenery {
  public getScene = () => {
    return this.scene;
  };

  private scene: THREE.Scene;

  constructor(origin: LngLat) {
    this.scene = new THREE.Scene();
    this.initScene(origin);
  }

  private initScene = (origin: LngLat) => {
    const sunLight = new THREE.DirectionalLight(0xffffff);
    sunLight.position.set(0, 70, 100).normalize();
    this.scene.add(sunLight);

    const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
    const boxMaterial = new THREE.MeshNormalMaterial();
    const box = new THREE.Mesh(boxGeometry, boxMaterial);

    const rwy01L = new LngLat(141.6927, 42.7622);
    const box1 = box.clone();
    const pos1 = GeoMath.getLocation(origin, rwy01L);
    box1.position.set(pos1.x, pos1.y, pos1.z);
    box1.rotation.y = 352;
    this.scene.add(box1);
  };

  public addObject = (position: LngLat | Vector3) => {};
}
