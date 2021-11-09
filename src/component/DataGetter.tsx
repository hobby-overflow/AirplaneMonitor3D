import React from "react";
import { AircraftDatabase } from "./AircraftDatabase";
import { AircraftList } from "../class/AircraftList";

import Config from "../config/config.json"

export class DataGetter extends React.Component<{},{acList:any}> {
    private intervalID: any;

    private signalSimulateMode!: boolean;
    constructor(props: any) {
        super(props);
        this.state = { acList: null }
    }
    componentDidMount () {
        console.log("Mounted!!");
        this.signalSimulateMode = Config.mode.simulation;
        // この書き方の参考URL: https://ja.reactjs.org/docs/state-and-lifecycle.html
        this.intervalID = setInterval(() => this.tick(), 1000)
    }
    
    componentWillUnmount () {
        clearInterval(this.intervalID);
    }
    
    tick() {
        let addr;
        if (this.signalSimulateMode == true) {
            addr = Config.access_url.simulate;
        } else {
            addr = Config.access_url.realtime;
        }

        fetch(addr, {
            method: "GET"})
        .then(response => response.json())
        .then(json =>  this.setState({ acList: json.acList }))
        .catch((error) => console.error(error));

    }
    
    render() {
        return (
        <AircraftDatabase acList={new AircraftList(this.state.acList) } />
        )
    }
}