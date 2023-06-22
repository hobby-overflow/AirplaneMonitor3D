import { LngLat } from 'mapbox-gl';
import {
  AmbientLight,
  Mesh,
  MeshStandardMaterial,
  Scene,
  Vector3,
} from 'three';
import { GeoMath } from './GeoMath';

import {
  Collada,
  ColladaLoader,
} from 'three/examples/jsm/loaders/ColladaLoader';
import { Object3D } from 'three';
import { Aircraft } from './Aircraft';
import { BoxGeometry } from 'three';
import { degToRad } from 'three/src/math/MathUtils';

export class Scenery {
  public getScene = () => {
    return this.scene;
  };

  private scene: Scene;
  private origin: LngLat;

  constructor(origin: LngLat) {
    this.scene = new Scene();
    this.initScene(origin);
    this.origin = origin;

    // const loader = new ColladaLoader();
    // loader.load('./B737-800.dae', (data: Collada) => {
    //   const model = data.scene;
    //   const modelScale = 1;
    //   model.scale.set(modelScale, modelScale, modelScale);
      // const airplane = new Object3D().copy(model);
      // const rwy01L = new LngLat(141.6927, 42.7622);
      // const pos1 = GeoMath.getLocation(origin, rwy01L);
      // airplane.position.set(pos1.x, pos1.y, pos1.z);
      // airplane.rotation.y = 352;

      // airplane.name = "B737";
      // airplane.visible = false;
      // this.scene.add(airplane);
    // });
  }

  private initScene = (origin: LngLat) => {
    // let b737Model: Object3D = new Object3D();


    // const sunLight = new THREE.DirectionalLight(0xffffff);
    // sunLight.position.set(0, 70, 100).normalize();
    const ambientLight = new AmbientLight(0xffffff, 1.0);
    this.scene.add(ambientLight);
  };

  public setLocation = async (aircraft: Aircraft) => {
    const scale = 100;
    // const boxGeometry = new BoxGeometry(scale, (scale * 3), scale)
    // const boxGeometry = new BoxGeometry(1, 1, 1);
    // const boxMaterial = new MeshStandardMaterial({ color: 0xff4500 });

    console.log(aircraft.info);
    const lngLat = new LngLat(aircraft.info.Long, aircraft.info.Lat);
    const location = GeoMath.getLocation(this.origin, lngLat);
    console.log(`${aircraft.info.Reg}: ${location}`);

    let obj = this.scene.getObjectByName(aircraft.info.Icao);

    if (obj != null) {
      obj.position.copy(location);
      obj.position.y = aircraft.info.Alt
      obj.rotation.z = degToRad(-aircraft.info.Trak)

      // obj.scale.setY(aircraft.info.Alt / 3.281)
      // obj.scale.setY(aircraft.info.Alt / 3.281)
      // obj.position.setY(obj.scale.y / 2)
    } else {
      // const acObj = new Mesh(boxGeometry, boxMaterial);
      // const acObj = new Object3D().copy(this.b737Model)

      const loader = new ColladaLoader()
      const collada = await loader.loadAsync('./B737-800.dae')
      const acObj = new Object3D().copy(collada.scene)
      acObj.scale.set(scale,scale,scale)

      // acObj.scale.set(scale, aircraft.info.Alt / 3.281, scale);
      acObj.name = aircraft.info.Icao;
      acObj.position.copy(location);
      acObj.position.setY(aircraft.info.Alt)
      acObj.rotation.z = degToRad(-aircraft.info.Trak)
      // const whd = new Vector3().copy(acObj.scale);
      // acObj.position.setY(whd.y / 2);
      this.scene.add(acObj);
    }
  };

  public removeAircraft = (aircraft: Aircraft) => {
    let obj = this.scene.getObjectByName(aircraft.info.Icao);
    if (obj != null) {
      this.scene.remove(obj);
    }
  };
}
