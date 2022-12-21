import React, { ReactElement } from 'react';
import { Aircraft } from '../class/Aircraft';

export class AircraftTable extends React.Component<
  {
    addAcList: Array<Aircraft>;
    updateAcList: Array<Aircraft>;
    removeAcList: Array<Aircraft>;
  },
  {}
> {
  constructor(props: any) {
    super(props);
  }

  private acDataBase: { [key: string]: Aircraft } = {};

  private isNullAcDataBase() {
    for (let item in this.acDataBase) {
      return false;
    }
    return true;
  }
  private getElement() {
    return document.getElementById('table') as HTMLTableElement;
  }

  componentDidMount() {
    let elem = this.getElement();
    elem.style.visibility = 'collapse';
  }

  componentDidUpdate() {
    if (this.isNullAcDataBase() == false) {
      let elem = this.getElement();
      elem.style.visibility = 'visible';
    }

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

    const hasLocation = (ac: Aircraft) => {
      // if (ac == null) return '❌';
      if (ac == null) return 'x';
      if (ac.info.Long == null) return 'x';
      if (ac.info.Lat == null) return 'x';
      if (ac.info.Alt == null) return 'x';
      if (ac.info.Trak == null) return 'x';

      // return true;
      // return '✅';
      return 'o';
    };

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
          <td>{hasLocation(item)}</td>
        </tr>
      );
    });
    return (
      <>
        <table id="table" className="table">
          <thead>
            <tr>
              <th>Reg</th>
              <th>Call</th>
              <th>Alt</th>
              <th>Spd</th>
              <th>Sqk</th>
              <th>Type</th>
              <th>Year</th>
              <th>hasPos</th>
            </tr>
          </thead>
          <tbody>{acTable}</tbody>
        </table>
      </>
    );
  }
}
