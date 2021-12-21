interface MapOptions {
  centerLat: number;
  centerLon: number;
  row: number;
  col: number;
  centerCol: number;
  centerRow: number;
  zoomLevel: number;
  imagePixel: number;
  api_id: string;
}

export class MapImage {
  public centerLat: number;
  public centerLon: number;
  public row: number;
  public col: number;
  public centerCol: number;
  public centerRow: number;
  public zoomLevel: number;
  public imagePixel: number;
  public api_id: string;

  public minTileNum: number[] = new Array();
  public maxTileNum: number[] = new Array();

  public mostSW: MostSW = { minLat: 0, minLon: 0 };
  public mostNE: MostNE = { maxLat: 0, maxLon: 0 };

  constructor(public options: MapOptions) {
    this.centerLat = options.centerLat;
    this.centerLon = options.centerLon;
    this.row = options.row;
    this.col = options.col;
    this.centerCol = options.centerCol;
    this.centerRow = options.centerRow;
    this.zoomLevel = options.zoomLevel;
    this.imagePixel = options.imagePixel;
    this.api_id = options.api_id;
  }

  dx(x: number): number {
    return x - this.centerRow;
  }
  dy(y: number): number {
    return y - this.centerCol;
  }
  private lat_deg2num(lat_deg: number, zoom: number): number {
    let lat_rad = lat_deg * (Math.PI / 180);
    let n = 2.0 ** zoom;
    let ytile = ((1.0 - Math.asinh(Math.tan(lat_rad)) / Math.PI) / 2.0) * n;

    return Math.floor(ytile);
  }
  private lon_deg2num(lon_deg: number, zoom: number): number {
    let n = 2.0 ** zoom;
    let xtile = ((lon_deg + 180) / 360.0) * n;

    return Math.floor(xtile);
  }

  public genUrl(): string[][] {
    let lon = this.centerLon;
    let lat = this.centerLat;
    let api_id = this.api_id;

    let row = this.row;
    let col = this.col;
    let zoomLevel = this.zoomLevel;

    let tileX = this.lon_deg2num(lon, zoomLevel);
    let tileY = this.lat_deg2num(lat, zoomLevel);

    let tbl: string[][] = new Array(col);
    for (let y = 0; y < col; y++) {
      tbl[y] = new Array(row).fill(0);
    }

    for (let y = 0; y < tbl.length; y++) {
      for (let x = 0; x < tbl[y].length; x++) {
        tbl[y][
          x
        ] = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/${zoomLevel}/${
          tileX - this.centerRow + x
        }/${tileY - this.centerCol + y}@2x?access_token=${api_id}`;
      }
    }
    // あえて一枚分ずらしている(タイル番号から座標を取得すると左上の座標が取得されるため)
    this.minTileNum = [tileX - this.centerRow, tileY - this.centerCol + col];
    this.maxTileNum = [tileX - this.centerRow + row, tileY - this.centerCol];

    this.mostSW = ((_) => {
      const n = 2.0 ** this.zoomLevel;
      const lon_deg = (this.minTileNum[0] / n) * 360.0 - 180.0;
      const lat_lad = Math.atan(
        Math.sinh(Math.PI * (1 - (2 * this.maxTileNum[1]) / n))
      );
      const lat_deg = lat_lad * (180 / Math.PI);
      return { minLon: lon_deg, minLat: lat_deg };
    })();

    this.mostNE = ((_) => {
      const n = 2.0 ** this.zoomLevel;
      const lon_deg = (this.maxTileNum[0] / n) * 360.0 - 180.0;
      const lat_lad = Math.atan(
        Math.sinh(Math.PI * (1 - (2 * this.minTileNum[1]) / n))
      );
      const lat_deg = lat_lad * (180 / Math.PI);
      return { maxLon: lon_deg, maxLat: lat_deg };
    })();

    return tbl;
  }
}
