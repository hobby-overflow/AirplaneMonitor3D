import React from "react";
import axios from "axios";

export class AxiosGet extends React.Component<{value: any}, {}>
{
  constructor(props: any) {
    super(props)
  }

  private isRequestSending = false;
  private intervalId: any;

  private requestGet = (url: string) => {
    if (this.isRequestSending == false) {
      this.isRequestSending = true;

      axios.get(url)
        .then((res) => console.log(res))
        .finally(() => this.isRequestSending = false)
    }
  }

  tick = () => {
    this.requestGet("http://localhost:8080/json");
  }

  componentDidMount = () => {
    this.intervalId = setInterval(() => this.tick(), 1000);
  }
  componentWillUnmount = () => {
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <p>AxiosGet</p>
    )
  }
}
