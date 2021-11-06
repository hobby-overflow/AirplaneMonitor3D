import React from "react";
import { Aircraft } from "../class/Aircraft";
import { AircraftList } from "../class/AircraftList";
import { Aircraft3DViewer } from "./Aircraft3DViewer";
import { AircraftTable } from "./AircraftTable";

// ここがコントローラーを担うことになってしまった
export class AircraftDatabase extends React.Component<{acList:AircraftList},{}> {

    private receivedAircraft = new Set();

    public aircraftDatabase: { [key: string]: Aircraft; } = {};

    public addAcList = new Array<Aircraft>();
    public updateAcList = Array<Aircraft>();
    public removeAcList = new Array<Aircraft>();
    
    constructor(props:any) {
        super(props);
    }
    
    isDuplicated(ac:Aircraft): boolean {
        return this.receivedAircraft.has(ac.info.Icao);
    }

    syncData(ac:Aircraft) {
        if (this.isDuplicated(ac) == true) {
            this.aircraftDatabase[ac.info.Icao] = ac;
            this.updateAcList.push(ac);
        } else {
            this.aircraftDatabase[ac.info.Icao] = (ac);
            this.addAcList.push(ac);
            this.receivedAircraft.add(ac.info.Icao);
        }
    }
    
    componentDidUpdate () {
        this.addAcList = new Array<Aircraft>();
        this.updateAcList = new Array<Aircraft>();
        this.removeAcList = new Array<Aircraft>();

        // 受信したデータの処理
        this.props.acList.acList.forEach((item: Aircraft) => {
            this.syncData(item);
        });

        // 受信できていないデータの処理
        Object.values(this.aircraftDatabase).forEach((item) => {
            if (item.isTimeout() == true) {
                delete this.aircraftDatabase[item.info.Icao];
                this.receivedAircraft.delete(item.info.Icao);
                this.removeAcList.push(item);
                // console.log("Timeout.. " + item.info.Reg);
            }
        })
    }
    render() {
        return (
        <>
            <Aircraft3DViewer addAcList={this.addAcList} updateAcList={this.updateAcList} removeAcList={this.removeAcList} />
            <AircraftTable addAcList={this.addAcList} updateAcList={this.updateAcList} removeAcList={this.removeAcList}/>
        </>
        )
    }
}