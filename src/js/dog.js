import { Actor, CollisionType, Color, Vector } from "excalibur";

export class Dog extends Actor {
    constructor() {
        super({
            width: 40,
            height: 50,
            color: Color.Brown,
            pos: new Vector(0, 0),
        })
    }

    onInitialize(engine) {
        this.actions.follow(this.scene.engine.player, 75)
        this.body.collisionType = CollisionType.Passive
    }
}