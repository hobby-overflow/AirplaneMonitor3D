import React from "react";
import { AircraftDatabase } from "./AircraftDatabase";
import { AircraftList } from "../class/AircraftList";
import { StatusMonitor } from "./StatusMonitor";

export class DataGetter extends React.Component<
  {},
  { acList: any; statusCode: number; statusMessage: string }
> {
  private intervalID: any;
  private config!: Config;

  private signalSimulateMode!: boolean;
  constructor(props: any) {
    super(props);
    this.state = { acList: null, statusCode: 0, statusMessage: "" };
  }

  init = async () => {
    await window.api.send("read_config", null);
    await window.api.on("read_config", (arg: string) => {
      if (arg != null) {
        this.config = JSON.parse(arg) as Config;
        this.signalSimulateMode = this.config.mode.simulation;
        // この書き方の参考URL: https://ja.reactjs.org/docs/state-and-lifecycle.html
        this.intervalID = setInterval(() => this.tick(), 1000);
      }
    });
  };

  componentDidMount = () => {
    this.init();
  };

  componentWillUnmount = () => {
    clearInterval(this.intervalID);
  };

  tick = () => {
    let addr: string;
    if (this.signalSimulateMode === true) {
      addr = this.config.access_url.simulate;
    } else {
      addr = this.config.access_url.realtime;
    }

    fetch(addr, { method: "GET" })
      .then((response) => response.json())
      .then((json) =>
        this.setState({
          acList: json.acList,
          statusCode: 0,
          statusMessage: "Data receving",
        })
      )
      .catch((error) => {
        if (this.signalSimulateMode === true) {
          this.setState({
            statusCode: 1,
            statusMessage: "Can't access SignalSimulator...",
          });
        } else {
          this.setState({
            statusCode: 1,
            statusMessage: "Can't access Virtual Radar Server...",
          });
        }
      });
  };

  render = () => {
    return (
      <>
        <AircraftDatabase acList={new AircraftList(this.state.acList)} />
        <StatusMonitor
          statusCode={this.state.statusCode}
          statusMessage={this.state.statusMessage}
        />
      </>
    );
  };
}
