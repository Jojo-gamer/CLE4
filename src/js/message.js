import { Actor, BaseAlign, Color, Font, FontUnit, Label, Vector } from "excalibur";

export class Message extends Label {
    constructor() {
        super({
            text: "Deur is geopend!",
            z: 99999,
            font: new Font({
                family: 'Arial',
                size: 24,
                unit: FontUnit.Px,
                color: Color.White,
                textAlign: "center",
            }),
            width: 400
        })
    }

    onInitialize(engine) {
        this.addChild(new Actor({
            width: 400,
            height: 50,
            y: 10,
            z: -1,
            color: Color.Azure
        }))

        this.actions.delay(2000).fade(0, 1000).callMethod(() => this.kill())
    }

    onPreUpdate(engine) {
        this.pos.x = this.scene.camera.pos.x
        this.pos.y = this.scene.camera.pos.y - 250
    }
}