import { Box3 } from "three";

export class CoordinateConverter {
    constructor(private mostSW: MostSW, private mostNE: MostNE, public boundary: Box3) {}
    
    Lon2PosX(lon: number): number {
        let per = -(Math.abs(this.mostSW.minLon - lon) / (Math.abs(this.mostSW.minLon - this.mostNE.maxLon)));
        return Math.abs(this.boundary.min.x - this.boundary.max.x) * per;
    }

    Lat2PosZ(lat: number) {
        let ret = -(Math.abs(this.mostSW.minLat - lat) / (Math.abs(this.mostSW.minLat - this.mostNE.maxLat)));
        return Math.abs(this.boundary.min.z - this.boundary.max.z) * ret;
    }
}