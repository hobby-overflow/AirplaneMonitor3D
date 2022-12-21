import mapboxgl from 'mapbox-gl';
import { LngLat, MercatorCoordinate } from 'mapbox-gl';
import { Matrix4, Vector3 } from 'three';

export type ModelTransform = {
  translateX: number;
  translateY: number;
  translateZ: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
};

export type Matrixes = {
  m: Matrix4;
  l: Matrix4;
};

export class MapboxMatrix {
  private origin?: LngLat;
  private transform?: ModelTransform;
  constructor() {
    this.calculateOrigin();
  }

  private calculateOrigin = () => {
    this.origin = new mapboxgl.LngLat(141.6769, 42.7831);
    const altitude = 0;
    const rotate = [Math.PI / 2, 0, 0];

    const asMercatorCoodinate = MercatorCoordinate.fromLngLat(
      this.origin,
      altitude
    );

    this.transform = {
      translateX: asMercatorCoodinate.x,
      translateY: asMercatorCoodinate.y,
      translateZ: asMercatorCoodinate.z!,
      rotateX: rotate[0],
      rotateY: rotate[1],
      rotateZ: rotate[2],
      scale: asMercatorCoodinate.meterInMercatorCoordinateUnits(),
    };

    return this.transform;
  };
  public calculateCameraMatrix = (matrix: number[]) => {
    const rotationX = new Matrix4().makeRotationAxis(
      new Vector3(1, 0, 0),
      this.transform!.rotateX
    );
    const rotationY = new Matrix4().makeRotationAxis(
      new Vector3(0, 1, 0),
      this.transform!.rotateY
    );
    const rotationZ = new Matrix4().makeRotationAxis(
      new Vector3(0, 0, 1),
      this.transform!.rotateZ
    );

    const m = new Matrix4().fromArray(matrix);
    const l = new Matrix4()
      .makeTranslation(
        this.transform!.translateX,
        this.transform!.translateY,
        this.transform!.translateZ
      )
      .scale(
        new Vector3(
          this.transform!.scale,
          -this.transform!.scale,
          this.transform!.scale
        )
      )
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);
    return { m: m, l: l };
  };

  public getOrigin = () => {
    return this.origin!;
  };
  public getTransform = () => {
    return this.transform!;
  };
}
