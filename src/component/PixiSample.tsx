import React from "react";
import * as PIXI from "pixi.js";
import { install } from "@pixi/unsafe-eval";

// unsafe evalとか言われて書いた
install(PIXI);

// この関数？名は文頭が大文字でないとエラーになる
// export const PixiSample = () => {
export class PixiSample extends React.Component<{},{}> {
    constructor(props: any) {
        super(props);
    }

    createApp = () => {
        const app = new PIXI.Application({
            width: innerWidth,
            height: innerWidth,
            backgroundAlpha: 0
        });
        const msg = new PIXI.Text("React PIXI.js!");
        msg.x = 150;
        msg.y = 100;
        msg.anchor.x = 0.5;
        msg.anchor.y = 0.5;
        msg.style.fill = "white";
        app.stage.addChild(msg);

        app.ticker.add(animate);

        var amountTime = 0;
        function animate(delta: number) {
            msg.rotation += 0.08;
            amountTime += delta;
        }

        const elem = document.getElementById("pixi");
        app.view.id = "pixicanvas";
        elem?.appendChild(app.view);
    }
    componentDidMount() {
        this.createApp();
    }

    render() {
        return (
            <div id="pixi"></div>
        )
    }
};