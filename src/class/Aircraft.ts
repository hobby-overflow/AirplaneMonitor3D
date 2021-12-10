import { Object3D } from "three";

export class Info {
    constructor(public HasSig: string,
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
    constructor(aircraft:any) {
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
    
    public isTimeout () {
        // 毎フレーム最後に受信した時間を確認する
        // getTimeは何の単位なのか?? 秒単位ではないミリ秒？: ミリ秒だった 
        let lastReceivedAt = new Date().getTime() - this.receivetAt.getTime();
        let diffSec = lastReceivedAt / 1000;

        if (diffSec >= 15) return true;
        return false;

    };
    
    public syncAircraft(newAc: Aircraft) {
        let object3d = this.object3D;
        // object3Dをnullにしたくい
        if (newAc.object3D == null) {
            newAc.object3D = object3d;
        }
        this.info = newAc.info;
    }
}