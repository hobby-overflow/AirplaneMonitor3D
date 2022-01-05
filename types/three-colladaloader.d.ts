/// <reference types="three" />

declare namespace THREE {
  interface ColladaOptions {
    centerGeometry: THREE.Geometry | false;
    convertUpAxis: boolean;
    subdivideFaces: boolean;
    upAxis: 'X' | 'Y' | 'Z';
    defaultEnvMap: THREE.Mapping;
  }

  interface ColladaObject {
    scene: THREE.Group;
    morphs: THREE.Mesh[];
    skins: THREE.SkinnedMesh[];
    animations: any[];
    kinematics: any;
    dae: {
      images: any[];
      materials: any[];
      cameras: any[];
      lights: any[];
      effects: any[];
      geometries: any[];
    };
  }

  interface ColladaLoadProgress {
    total: number;
    loaded: number;
  }

  interface ColladaLoadError {
    type: string;
    url: string;
  }

  class ColladaLoader {
    options: ColladaOptions;
    load(
      url: string,
      onLoad?: (object: ColladaObject) => void,
      onProgress?: (progress: ColladaLoadProgress) => void,
      onFail?: (reason: ColladaLoadError) => void
    ): void;
    parse(
      doc: XMLDocument,
      callback?: (object: ColladaObject) => void,
      url?: string
    ): void;
    setPreferredShading(shading: THREE.Shading): void;
    applySkin(
      geometry: THREE.Geometry,
      instanceCtrl: any,
      frame?: number
    ): void;
  }
}
