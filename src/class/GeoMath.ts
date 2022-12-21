import { Vector3 } from 'three';
import { LngLat } from 'mapbox-gl';

export class GeoMath {
  static radian = (deg: number) => {
    return deg * (Math.PI / 180);
  };
  static degree = (rad: number) => {
    return rad * (180 / Math.PI);
  };

  static getBearing = (pos1: LngLat, pos2: LngLat): number => {
    let dLng = pos2.lng - pos1.lng;

    const x = Math.cos(this.radian(pos2.lat)) * Math.sin(this.radian(dLng));
    const y =
      Math.cos(this.radian(pos1.lat)) * Math.sin(this.radian(pos2.lat)) -
      Math.sin(this.radian(pos1.lat)) *
        Math.cos(this.radian(pos2.lat)) *
        Math.cos(this.radian(dLng));

    let bearingRadian = Math.atan2(x, y);

    let bearingDegree = this.degree(bearingRadian);
    if (bearingDegree > 0.0) return bearingDegree;
    return bearingDegree + 360;
  };

  static getLocation = (origin: LngLat, to: LngLat) => {
    const distance = origin.distanceTo(to);
    const bearing = this.getBearing(origin, to);
    let x = distance * Math.sin((Math.PI * 2 * bearing) / 360);
    let z = distance * Math.cos((Math.PI * 2 * bearing) / 360);
    return new Vector3(x, 0, -z);
  };
}
