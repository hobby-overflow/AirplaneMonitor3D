import { Object3D } from 'three';

export class Info {
  constructor(
    public HasSig: string,
    public Icao: string,
    public Reg: string,
    public Call: string,
    public Alt: number,
    public Lat: number,
    public Long: number,
    public Spd: number,
    public Trak: number,
    public Type: string,
    public OpIcao: string,
    public Sqk: string,
    public Year: string
  ) {}
  public label = this.Call || this.Reg || this.Type || this.Reg;
}

export class Aircraft {
  public info: Info;
  private receivetAt: Date = new Date();
  public screenX: number = 0;
  public screenY: number = 0;
  constructor(aircraft: any) {
    let ac = aircraft;
    this.info = new Info(
      ac.HasSig,
      ac.Icao,
      ac.Reg,
      ac.Call,
      ac.Alt,
      ac.Lat,
      ac.Long,
      ac.Spd,
      ac.Trak,
      ac.Type,
      ac.OpIcao,
      ac.Sqk,
      ac.Year
    );
  }
  public object3D?: Object3D;

  public isTimeout() {
    // getTime units is milliseconds (ms)
    let lastReceivedAt = new Date().getTime() - this.receivetAt.getTime();
    let diffMs = lastReceivedAt / 1000;

    if (diffMs >= 15) return true;
    return false;
  }

  public syncAircraft(newAc: Aircraft) {
    let object3d = this.object3D;
    if (newAc.object3D == null) {
      newAc.object3D = object3d;
    }
    this.info = newAc.info;
  }
}
