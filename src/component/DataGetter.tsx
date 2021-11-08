import React from "react";
import { AircraftDatabase } from "./AircraftDatabase";
import { AircraftList } from "../class/AircraftList";

export class DataGetter extends React.Component<{},{acList:any}> {
    private intervalID: any;

    constructor(props: any) {
        super(props);
        this.state = { acList: null }
    }
    componentDidMount () {
        console.log("Mounted!!");
        // この書き方の参考URL: https://ja.reactjs.org/docs/state-and-lifecycle.html
        this.intervalID = setInterval(() => this.tick(), 1000)
    }
    
    componentWillUnmount () {
        clearInterval(this.intervalID);
    }
    
    tick() {
        const virtualRadar = "http://localhost:8080/VirtualRadar/AircraftList.json";
        // const signalSimulator = "http://localhost:8080/json";
        fetch(virtualRadar, {
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