import React, { ReactElement } from "react";
import { Aircraft } from "../class/Aircraft";

export class AircraftTable extends React.Component<{ addAcList:Array<Aircraft>, updateAcList:Array<Aircraft>, removeAcList:Array<Aircraft> }, {}> {
    constructor(props:any) {
        super(props);
    }
    
    private acDataBase: { [key: string]: Aircraft } = {};

    componentDidUpdate () {
        this.props.removeAcList.forEach((item) => {
            delete this.acDataBase[item.info.Icao];
        });

        this.props.addAcList.forEach((item) => {
            this.acDataBase[item.info.Icao] = item;
        });

        this.props.updateAcList.forEach((item) => {
            this.acDataBase[item.info.Icao] = item;
        });
    }
    
    render() {
        var acTable = new Array<ReactElement>();

        Object.values(this.acDataBase).forEach((item) => {
            acTable.push(
            <tr key={item.info.Icao}>
                <td>{item.info.Reg}</td>
                <td>{item.info.Call}</td>
                <td>{item.info.Alt}</td>
                <td>{item.info.Spd}</td>
                <td>{item.info.Sqk}</td>
                <td>{item.info.Type}</td>
                <td>{item.info.Year}</td>
            </tr>);
        });
        return (
            <>
                <table className="table">
                <thead>
                    <tr>
                        <th>Reg</th>
                        <th>Call</th>
                        <th>Alt</th>
                        <th>Spd</th>
                        <th>Sqk</th>
                        <th>Type</th>
                        <th>Year</th>
                    </tr>
                </thead>
                <tbody>
                    {acTable}
                </tbody>
                </table>
            </>
        );
    }
}