import * as PIXI from 'pixi.js';

export class Label {
    container: PIXI.Container;
    private pixiText: PIXI.Text;
    private opacity: number = 0.6;
    private box: PIXI.Graphics;
    private boxpadding: number = 1;
    private textScale: number = 0.6;

    public setPostion(x: number, y: number) {
        this.container.position.x = x;
        this.container.position.y = y;
    }
    public setLabelText(text: string) {
        this.pixiText.text = text;
        this.BoxDraw();
    }
    constructor(private text: string, private x: number, private y: number, private z: number) {
        this.container = new PIXI.Container();
        this.container.sortableChildren = true;
        this.container.pivot.x = this.container.width / 2;
        this.container.pivot.y = this.container.height / 2;
        this.container.x = x;
        this.container.y = y;

        this.pixiText = new PIXI.Text(text);
        this.pixiText.style = new PIXI.TextStyle({
            fontFamily: "\"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif"
        });
        this.pixiText.scale.x = this.textScale;
        this.pixiText.scale.y = this.textScale;
        this.pixiText.anchor.x = 0.5; // 1 = 右へ
        this.pixiText.anchor.y = 0.5; // 1 = 下へ
        this.pixiText.style.fill = "black";
        this.pixiText.zIndex = 1;
        this.container.addChild(this.pixiText);

        this.box = new PIXI.Graphics();

        this.BoxDraw();


        this.box.zIndex = 0;
        this.container.addChild(this.box);
    }
    private BoxDraw() {
        this.box.clear();
        this.box.beginFill(0xffff00, this.opacity);
        this.box.drawRect(
            (this.pixiText.x
                - (this.pixiText.width * this.pixiText.anchor.x))
            - (this.boxpadding / 2),
            (this.pixiText.y
                - (this.pixiText.height * this.pixiText.anchor.y))
            - (this.boxpadding / 2),
            this.pixiText.width + (this.boxpadding),
            this.pixiText.height + (this.boxpadding)
        );
        this.box.endFill;
    }
}