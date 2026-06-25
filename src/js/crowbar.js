import { Actor, CollisionType, Vector } from "excalibur";
import { Resources } from "./resources";

export class Crowbar extends Actor {
    isReal
    isRayCastable = true

    constructor(pos, isReal = false) {
        const sprite = Resources.Crowbar.toSprite()
        super({
            width: sprite.width,
            height: sprite.height,
            pos: pos
        })
        this.graphics.use(sprite)
        this.scale = new Vector(0.2, 0.2)
        this.body.collisionType = CollisionType.Active
        this.isReal = isReal
    }

    onPreUpdate(engine) {
        if (!this.isReal) {
            const distance = Vector.distance(this.scene.player.pos, this.pos)
            if (distance < 200) {
                let direction = this.pos.sub(this.scene.player.pos).normalize()
                this.vel = direction.negate().scale(-500)
            }
        }
    }
} 