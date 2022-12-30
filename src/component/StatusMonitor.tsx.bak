import React from 'react';

export class StatusMonitor extends React.Component<
  { statusCode: number; statusMessage: string },
  {}
> {
  constructor(props: any) {
    super(props);
  }

  private elementId = 'statusMonitor';

  private getElement() {
    return document.getElementById(this.elementId) as HTMLParagraphElement;
  }
  componentDidMount = () => {
    let elem = this.getElement();
    elem.style.visibility = 'collapse';
  };
  componentDidUpdate = () => {
    let elem = this.getElement();
    elem.style.visibility = 'visible';
    if (elem != null) {
      if (this.props.statusCode == 0) {
        elem.style.color = 'darkgreen';
      }
      if (this.props.statusCode != 0) {
        elem.style.color = 'red';
      }
    }
  };

  render() {
    return <p id={this.elementId}>{this.props.statusMessage}</p>;
  }
}
