import { Actor, BaseAlign, Color, Font, FontUnit, Label, Vector } from "excalibur";

export class Message extends Label {
    constructor(text = "Deur is geopend!") {
        super({
            text: text,
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
            width: this.getTextWidth() * 3,
            height: 50,
            y: 10,
            z: -1,
            color: Color.fromHex('#4e0654')
        }))

        this.actions.delay(2000).fade(0, 1000).callMethod(() => this.kill())
    }

    onPreUpdate(engine) {
        this.pos.x = this.scene.camera.pos.x
        this.pos.y = this.scene.camera.pos.y - 250
    }
}