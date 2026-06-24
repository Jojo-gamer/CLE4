import { Actor, CollisionType, Vector } from "excalibur";
import { Resources } from "./resources";

export class Crowbar extends Actor {
    constructor(){
        const sprite = Resources.Crowbar.toSprite()
        super({
            width: sprite.width,
            height: sprite.height,
            pos: new Vector(640, 360)
        })
        this.graphics.use(sprite)
        this.scale = new Vector(0.2, 0.2)
    }
} 