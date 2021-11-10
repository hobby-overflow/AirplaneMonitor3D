import * as PIXI from "pixi.js";
import React from "react";
import { Aircraft } from "../class/Aircraft";
import { Label } from "../class/Label";

class AircraftLabel {
  constructor(public label: Label, public ac: Aircraft) {}
}
export class PixiViewer extends React.Component<
  {
    addAircrafts: { [key: string]: Aircraft };
    updateAircrafts: { [key: string]: Aircraft };
    removeAircrafts: { [key: string]: Aircraft };
  },
  {}
> {
  constructor(props: any) {
    super(props);
  }

  private app!: PIXI.Application;
  private acList: { [key: string]: AircraftLabel } = {};

  componentDidMount() {
    this.init();
  }

  componentDidUpdate() {
    this.removeLabel();
    this.addLabel();
  }

  removeLabel = () => {
    if (this.props.removeAircrafts != null) {
      Object.keys(this.props.removeAircrafts).forEach((key) => {
        // console.log(this.props.removeAircrafts[key]);
        if (this.acList[key] == null) return;

        this.app.stage.removeChild(this.acList[key].label.container);
        delete this.acList[key];
      });
    }
  }
  syncLabel = (ac: Aircraft): string =>{
    let info = ac.info;
    return info.Call || info.Reg || info.Type;
  }

  addLabel = () => {
    if (this.props.addAircrafts == null) return;

    Object.keys(this.props.addAircrafts).forEach((key) => {
      let newAc = this.props.addAircrafts[key];
      let label = this.syncLabel(newAc);

        this.acList[key] = new AircraftLabel(
          new Label(label, newAc.screenX, newAc.screenY, 0), newAc
        );
      this.app.stage.addChild(this.acList[key].label.container);
    });
  }

  updateLabel = () => {
    Object.keys(this.props.updateAircrafts).forEach((key) => {
      if (this.acList[key] == null) return;
      
      let newAc = this.props.updateAircrafts[key];

      if (newAc.screenX != 0 || newAc.screenY != 0) {
        this.acList[key].label.setPostion(newAc.screenX + 70, newAc.screenY);
        
        // 優先順位の高いデータが受信されたら更新する
        if (this.acList[key].label.getLabelText() != this.syncLabel(newAc)) {
          this.acList[key].label.setLabelText(this.syncLabel(newAc));
        }
      }
    });
  };

  init() {
    this.app = new PIXI.Application({
      width: innerWidth,
      height: innerHeight,
      backgroundAlpha: 0,
      view: document.getElementById("pixi") as HTMLCanvasElement,
    });
    this.app.screen.height = innerHeight;
    this.app.screen.width = innerWidth;

    this.app.stage.sortableChildren = true;

    const animate = () => {
      this.app.render();

      this.updateLabel();

      setTimeout(() => {
        requestAnimationFrame(() => animate());
      }, 1000 / 30);
    };
    animate();

    // this.app.ticker.add(animate);
  }

  render() {
    return (
      <>
        <canvas id="pixi"></canvas>
      </>
    );
  }
}
