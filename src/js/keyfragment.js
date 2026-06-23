import { Actor, Color, SpriteSheet, Vector } from "excalibur";
import { Resources } from "./resources";

export class Keyfragment extends Actor {
    constructor(position, keyfragmentPart = 0) {
        super({
            width: 75,
            height: 75,
            color: Color.Brown,
            pos: position
        })
        this.keyfragmentPart = keyfragmentPart
    }

    onInitialize(engine) {
        const keyParts = SpriteSheet.fromImageSource({
            image: Resources.Key,
            grid: {
                spriteWidth: 75,
                spriteHeight: 177,
                columns: 2,
                rows: 1,
            }
        })
        if (this.keyfragmentPart === 0) {
            this.graphics.use(keyParts.getSprite(0, 0))
            this.anchor = new Vector(0.5, 0.7)
        } else if (this.keyfragmentPart === 1) {
            this.graphics.use(keyParts.getSprite(1, 0))
            this.anchor = new Vector(0.5, 0.3)
        }
        this.scale = new Vector(0.4, 0.4)
    }
}