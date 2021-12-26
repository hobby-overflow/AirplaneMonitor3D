import React from "react";

export class StatusMonitor extends React.Component<
  { statusCode: number; statusMessage: string },
  {}
> {
  constructor(props: any) {
    super(props);
  }

  componentDidUpdate = () => {
    let elem = document.getElementById("statusMonitor");
    if (elem != null) {
      if (this.props.statusCode == 0) {
        elem.style.color = "darkgreen";
      }
      if (this.props.statusCode != 0) {
        elem.style.color = "red";
      }
    }
  };

  render() {
    return <p id="statusMonitor">{this.props.statusMessage}</p>;
  }
}
