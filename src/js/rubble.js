import { Actor, CollisionType, vec } from "excalibur"
import { Resources } from "./resources"

export class Rubble extends Actor {
    constructor(tileWidth, tileHeight) {
        const rubbleSprite = Resources.Rubble.toSprite()
        super({
            width: rubbleSprite.width,
            height: rubbleSprite.height - 150,
            pos: vec(8 * tileWidth, 15 * tileHeight),
            graphic: rubbleSprite, scale: vec(0.7, 0.5),
            collisionType: CollisionType.Fixed
        })
    }

    onPreUpdate(engine) {
        if (engine.collectedCrowbar) {
            this.actions.callMethod(() => {
                this.kill()
            })
        }
    }
}