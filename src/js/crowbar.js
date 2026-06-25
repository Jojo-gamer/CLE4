import { Actor, CollisionType, Vector } from "excalibur";
import { Resources } from "./resources";

export class Crowbar extends Actor {
    constructor(posX, posY) {
        const sprite = Resources.Crowbar.toSprite()
        super({
            width: sprite.width,
            height: sprite.height,
            pos: new Vector(posX, posY)
        })
        this.graphics.use(sprite)
        this.scale = new Vector(0.2, 0.2)
        this.body.collisionType = CollisionType.Active
    }

    onPreUpdate(engine){
        const distance = Vector.distance(this.scene.player.pos, this.pos)
        if(distance < 200) {
            let direction = this.pos.sub(this.scene.player.pos).normalize()
            this.vel = direction.negate().scale(-500)
        }
    }
} 