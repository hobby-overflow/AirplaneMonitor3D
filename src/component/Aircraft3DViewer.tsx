import React from "react";
import * as THREE from "three";
import { Aircraft } from "../class/Aircraft";
import { MapImage } from "../class/MapGetter";
import { MapControls } from "../lib/OrbitControls";

import SkyPanoramic from "../assets/SkyPanoramic_mini.png";
import { CoordinateConverter } from "../class/Converter";
import { ColladaLoader } from "../lib/ColladaLoader.js";

export class Aircraft3DViewer extends React.Component<
  {
    addAcList: Array<Aircraft>;
    updateAcList: Array<Aircraft>;
    removeAcList: Array<Aircraft>;
  },
  {}
> {
  constructor(props: any) {
    super(props);
  }

  private Config!: Config;

  private altMag = 0.004;
  private modelScale = 0.4;

  // Icaoをキーにして管理する
  private acModelDatabase: { [key: string]: THREE.Object3D } = {};
  private acDatabase: { [key: string]: Aircraft } = {};

  private updateAircrafts: { [key: string]: Aircraft } = {};
  private addAircrafts: { [key: string]: Aircraft } = {};
  private removeAircrafts: { [key: string]: Aircraft } = {};

  // 機体モデルデータをここからコピーして使う
  private modelsDataPool: { [key: string]: THREE.Object3D } = {};

  private loadModelData() {
    const modelFiles: { [key: string]: string } = {
      B737: "./B737-800.dae",
      B77W: "./B777-300ER.dae",
    };
    const loader = new ColladaLoader();
    Object.keys(modelFiles).forEach((key) => {
      loader.load(modelFiles[key], (data: THREE.ColladaObject) => {
        const model = data.scene;
        model.scale.set(this.modelScale, this.modelScale, this.modelScale);
        this.modelsDataPool[key] = model;
      });
    });
  }

  private hasLocation(ac: Aircraft): boolean {
    if (ac == null) return false;
    if (ac.info.Long == null) return false;
    if (ac.info.Lat == null) return false;
    if (ac.info.Alt == null) return false;
    if (ac.info.Trak == null) return false;

    return true;
  }

  // 3D空間内にモデルを追加しプロットする
  private plotAc = (ac: Aircraft) => {
    let icaoId = ac.info.Icao;
    
    if (ac.object3D == null) {
      // 読み込んだモデルデータをコピーする
      // デフォルトでB737を表示する
      ac.object3D = this.modelsDataPool["B737"].clone();
      this.addAircrafts[icaoId] = ac;
      if (ac.info.Type == "B738")
        ac.object3D = this.modelsDataPool["B737"].clone();
      if (ac.info.Type == "B77W")
        ac.object3D = this.modelsDataPool["B77W"].clone();
      if (ac.info.Type == "B772")
        ac.object3D = this.modelsDataPool["B77W"].clone();
        
      // databaseに登録する
      this.acModelDatabase[icaoId] = ac.object3D;
      this.acDatabase[icaoId] = ac;
    }

    this.setLocation(this.acModelDatabase[icaoId], ac);

    let position = this.acModelDatabase[icaoId].position;
    let yZeroPos = new THREE.Vector3(position.x, -3000, position.z);
    let lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 4
    });
    let lineGeometry = new THREE.BufferGeometry().setFromPoints([ position, yZeroPos ]);
    let line = new THREE.Line(lineGeometry, lineMaterial);
    line.name = "line_" + icaoId;
    this.acModelDatabase[icaoId].attach(line);

    console.log(`plotted! ${ac.info.Reg}`);

    this.acModelDatabase[icaoId].name = icaoId;
    this.scene.add(this.acModelDatabase[icaoId]);
  };


  // 座標を更新する
  private setLocation = (acModel: THREE.Object3D, ac: Aircraft) => {
    if (this.hasLocation(ac) == false) return;
    let icaoId = ac.info.Icao;
    // 位置情報を持っていないなら
    if (acModel == null) {
      // 暫定対策
      // もしかしたらここは必要なくなるかもしない
      if (ac.object3D != null) {
        this.acModelDatabase[icaoId] = ac.object3D;
      }
      this.plotAc(ac);
      // とりあえずこの問題はラベルを実装してからにする
      // rePlotは起きていない？
      console.log(`re ploted ${ac.info.Reg}`);
      return;
    }

    acModel.position.set(
      this.converter.Lon2PosX(ac.info.Long) + this.converter.boundary.max.x,
      ac.info.Alt * this.altMag,
      this.converter.Lat2PosZ(ac.info.Lat) + this.converter.boundary.max.z
    );
    acModel.rotation.z = (function () {
      const modelRotate = 180;
      return (-ac.info.Trak + modelRotate) * (Math.PI / 180);
    })();

    this.acModelDatabase[icaoId] = acModel;
    this.updateAircrafts[icaoId] = ac;
  };

  removeAircraft = () => {
    Object.keys(this.removeAircrafts).forEach((key) => {
      delete this.removeAircrafts[key];
      delete this.acDatabase[key];
    });

    this.props.removeAcList.forEach((ac) => {
      let icaoId = ac.info.Icao;
      if (this.hasLocation(ac) == false) return;

      this.removeAircrafts[icaoId] = ac;

      if (this.scene.getObjectByName(icaoId) == null) return;

      this.scene.remove(this.acModelDatabase[icaoId]);
      delete this.acModelDatabase[icaoId];
      delete this.acDatabase[icaoId];
      delete this.updateAircrafts[icaoId];
      this.removeLabel(icaoId);
    });
  };


  updateAircraft = () => {
    this.props.updateAcList.forEach((newAc) => {
      let icaoId = newAc.info.Icao;

      // 座標データを持っていないなら処理をしない
      if (this.hasLocation(newAc) == false) return;

      // プロットされていないならプロットする
      // (addAircraftの時点で座標が来なかった場合に実行される)
      if (this.scene.getObjectByName(icaoId) == null) {
        this.plotAc(newAc);
        this.setLabel(newAc);
        return;
      }

      // データの更新
      delete this.addAircrafts[icaoId];
      if (this.acDatabase[icaoId] != null) {
        this.acDatabase[icaoId].syncAircraft(newAc); // モデルデータのnullで更新しない
      }

      // 座標の更新
      this.setLocation(this.acModelDatabase[icaoId], this.acDatabase[icaoId]);
    });
  };

  addAircraft = () => {
    this.props.addAcList.forEach((ac) => {
      if (this.hasLocation(ac) == false) return;
      if (this.scene.getObjectByName(ac.info.Icao) != null) return;

      // // databaseに登録する
      // this.acModelDatabase[ac.info.Icao] = ac.object3D;
      this.acDatabase[ac.info.Icao] = ac;
      this.plotAc(ac);
      this.setLabel(ac);
    });
  };
  
  setLabel = (ac: Aircraft) => {
    let elem = document.getElementById("labelContainer");
    if (elem != null) {
      let p = document.createElement('p');
      p.id = ac.info.Icao;
      p.className = 'label';
      p.innerText = ac.info.label;
      elem.appendChild(p);
    }
  }
  removeLabel = (icaoId: string) => {
    let elem = document.getElementById(icaoId);
    if (elem != null) {
      elem.remove();
    }
  };


  // ここからワールド空間の設定やレンダリング処理
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera();
  private threeRenderer = new THREE.WebGLRenderer();

  private converter!: CoordinateConverter;

  private calculateScreenPosition = (aircrafts: {
    [key: string]: Aircraft;
  }) => {
    Object.keys(aircrafts).forEach((key) => {

      const ac = aircrafts[key];
      const acModel = this.acModelDatabase[key];
      
      let screenV = new THREE.Vector3();
      if (this.hasLocation(ac) == false) return;
      if (acModel == null) return;
      
      screenV.copy(acModel.position);
      screenV.project(this.camera);
      if (screenV.z > 1.0) return;
      let screenPosX, screenPosY, screenPosZ;
      
      screenPosX = (screenV.x + 1) * innerWidth / 2;
      screenPosY = - (screenV.y - 1) * innerHeight / 2;
      screenPosZ = screenV.z;
      
      if (screenPosX == 0 && screenPosY == 0) return;
      
      ac.screenX = screenPosX;
      ac.screenY = screenPosY;
      
      let labelElem = document.getElementById(ac.info.Icao);
      if (labelElem != null) {
        labelElem.style.left = screenPosX.toString() + 'px';
        labelElem.style.top = screenPosY.toString() + 'px';
      }
    });
  };

  
  viewerTick = () => {
    setTimeout(() => {
      requestAnimationFrame(() => this.viewerTick());
    }, 1000 / 30);

    this.threeRenderer.render(this.scene, this.camera);

    this.calculateScreenPosition(this.updateAircrafts);
    this.calculateScreenPosition(this.addAircrafts);
  };
  countPlottedAircrafts(): number {
    let cnt = 0;
    for (let key in this.updateAircrafts) {
      let ac = this.updateAircrafts[key];
      if (this.hasLocation(ac) == false) continue;
      cnt += 1;
    }
    return cnt;
  }

  componentDidMount = async () => {
    window.api.send('read_config', null);
    window.api.on('read_config', (arg: string) => {
      if (arg != null) {
        this.Config = JSON.parse(arg) as Config;

        this.init();
        this.loadModelData();
      }
    });
  }

  // ここに来るデータは位置情報を持っている航空機のみで良いはず
  // 2021/10/14時点
  componentDidUpdate() {
    // DB -> viewer
    // 先にremoveAcListを処理する(delete ac 的な感じ)
    // AddAcとUpdateAcの 順序は影響しないはず?
    // ここでAddAcUpdateAcが来たらOjectPool
    this.removeAircraft();
    this.addAircraft();
    this.updateAircraft();
    
    // console.log(`remove ${Object.keys(this.removeAircrafts).length}`)
    // console.log(`add ${Object.keys(this.addAircrafts).length}`)
    // console.log(`update ${Object.keys(this.updateAircrafts).length}`);
    // console.log('====================================================');
  }

  render() {
    return (
      <>
        <canvas id="three"></canvas>
        <div id="labelContainer"></div>
      </>
    );
  }

  init() {
    const width = innerWidth;
    const height = innerHeight;
    this.threeRenderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#three") as HTMLCanvasElement,
      antialias: false,
    });
    this.threeRenderer.setPixelRatio(window.devicePixelRatio);
    this.threeRenderer.setSize(width, height);

    // カメラの定
    let fov = 30;
    let aspect = window.innerWidth / window.innerHeight;
    let near = 0.4;
    let far = 5000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    let cameraPosX = 270;
    let cameraPosY = 500;
    let cameraPosZ = -613;

    this.camera.position.set(cameraPosX, cameraPosY, cameraPosZ);
    this.camera.updateMatrix();

    // ライトの設定
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    this.scene.add(directionalLight);

    // MapControllerの設定
    let canvas = document.getElementById("three");
    let controls = new MapControls(this.camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.5;
    controls.screenSpacePanning = false;
    controls.panSpeed = 0.4;

    controls.minDistance = 10;
    controls.maxDistance = 1000;

    controls.maxPolarAngle = Math.PI / 2;

    controls.target.set(300, 20, -300);

    // this.camera.rotation.z = 180 * Math.PI / 180;
    this.camera.updateMatrix();
    controls.update();

    // 地図の描画
    let map = new MapImage({
      // centerLat: 42.820972,
      centerLat: this.Config.map.centerLat,
      centerLon: this.Config.map.centerLon,
      row: 4,
      col: 5,
      centerCol: 2,
      centerRow: 1,
      zoomLevel: 7,
      imagePixel: 1024,
      api_id: this.Config.map.api_id
    });

    //地図画像の読み込み
    var mapLoader = new THREE.TextureLoader();
    const urlArray = map.genUrl();

    // 地図画像配列の確j保
    var mapImages = new Array(map.col);
    for (let y = 0; y < mapImages.length; y++) {
      mapImages[y] = new Array(map.col).fill(0);
    }

    for (let y = 0; y < urlArray.length; y++) {
      for (let x = 0; x < urlArray[y].length; x++) {
        mapImages[y][x] = mapLoader.load(urlArray[y][x]);
      }
    }

    let mapHeight = 500;
    let mapWidth = 500;

    let mapMaterial = new Array(map.col);
    let mapGeometry = new THREE.PlaneGeometry(mapWidth, mapHeight);
    let maps: THREE.Mesh[][] = new Array(map.col);

    var mapGroup = new THREE.Object3D();

    for (let j = 0; j < map.col; j++) {
      mapMaterial[j] = new Array(map.col);
      maps[j] = new Array(map.row);
      for (let i = 0; i < map.row; i++) {
        mapMaterial[j][i] = new THREE.MeshBasicMaterial({
          map: mapImages[j][i],
        });
        maps[j][i] = new THREE.Mesh(mapGeometry, mapMaterial[j][i]);
        maps[j][i].position.x = mapWidth / 2 - mapHeight * (i - 1);
        maps[j][i].position.y = 0;
        maps[j][i].position.z = -mapHeight * (j - 1);

        maps[j][i].rotation.x = (270 * Math.PI) / 180;
        maps[j][i].rotation.z = (180 * Math.PI) / 180;

        mapGroup.add(maps[j][i]);
      }
    }

    mapGroup.position.set(0, 0, 0);
    mapGroup.scale.set(1, 1, 1);

    const bbox = new THREE.Box3().setFromObject(mapGroup);
    this.scene.add(mapGroup);

    // map correction
    let mapCorrectX = 0;
    let mapCorrectZ = 40;
    mapGroup.position.set(mapCorrectX, 0, mapCorrectZ);

    this.converter = new CoordinateConverter(map.mostSW, map.mostNE, bbox);

    // // 函館
    // addLocationBox(140.728917, 41.768667);
    // // 釧路
    // addLocationBox(144.381711, 42.984889);
    // // 稚内
    // addLocationBox(141.673056, 45.415556);
    // // 利尻
    // addLocationBox(141.139722, 45.186944);
    // // 襟裳岬
    // addLocationBox(143.249167, 41.924444);

    const panoramicTexture = new THREE.TextureLoader().load(SkyPanoramic);
    const atomosGeometry = new THREE.SphereBufferGeometry(2000, 60, 40);
    const atomosMaterial = new THREE.MeshBasicMaterial({
      map: panoramicTexture,
    });
    const atomoSphere = new THREE.Mesh(atomosGeometry, atomosMaterial);
    atomosGeometry.scale(-1, 1, 1);
    this.scene.add(atomoSphere);

    this.viewerTick();
  }
}
