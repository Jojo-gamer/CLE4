import { Actor, CollisionType, Color, Vector } from "excalibur";
import { Crowbar } from "./crowbar";

export class CrowbarSpawn extends Actor {
    constructor(sceneWidth, sceneHeight) {
        super({
            radius: 50,
            pos: new Vector(sceneWidth / 2, sceneHeight / 2),
            color: Color.White
        })
    }

    onInitialize(engine) {
        const fake = new Crowbar(this.pos, false)
        const real = new Crowbar(this.pos, true)
        real.graphics.opacity = 0
        real.body.collisionType = CollisionType.Passive
        this.scene.add(fake)
        this.scene.add(real)
    }
}