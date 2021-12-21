import React from "react";
import { AircraftDatabase } from "./AircraftDatabase";
import { AircraftList } from "../class/AircraftList";

export class DataGetter extends React.Component<{}, { acList: any }> {
  private intervalID: any;
  private config!: Config;

  private signalSimulateMode!: boolean;
  constructor(props: any) {
    super(props);
    this.state = { acList: null };
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
    let addr;
    if (this.signalSimulateMode === true) {
      addr = this.config.access_url.simulate;
    } else {
      addr = this.config.access_url.realtime;
    }

    fetch(addr, { method: "GET" })
      .then((response) => response.json())
      .then((json) => this.setState({ acList: json.acList }))
      .catch((error) => console.error(error));
  };

  render = () => {
    return <AircraftDatabase acList={new AircraftList(this.state.acList)} />;
  };
}
