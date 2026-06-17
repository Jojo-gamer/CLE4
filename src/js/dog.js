import { Actor, CollisionType, Color, Keys, Ray, Sound, Vector } from "excalibur";
import { Resources } from "./resources";

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
        this.actions.follow(this.scene.player, 75)
        this.body.collisionType = CollisionType.Passive
    }

    onPreUpdate(engine) {
        if (engine.input.keyboard.wasPressed(Keys.Space)) {
            const player = this.scene.player
            let dir = Vector.Up
            if (player.dirUp) dir = Vector.Up
            if (player.dirDown) dir = Vector.Down
            if (player.dirLeft) dir = Vector.Left
            if (player.dirRight) dir = Vector.Right

            const ray = new Ray(this.pos, dir);
            const hits = this.scene.physics.rayCast(ray, {
                searchAllColliders: false, // Stop direct bij het eerste doelwit
                maxDistance: 225,
                filter: (hit) => {
                    if (hit.collider.owner !== player && hit.collider.owner !== this) {
                        return true
                    }
                }
            });
            if (hits.length > 0) {
                const owner = hits[0].collider.owner
                if (!owner.isReal) {
                    console.log(owner)
                    owner.body.collisionType = CollisionType.Passive
                } else {
                    console.log('WOOF')
                    Resources.BarkSound.play()
                }

            }
        }
    }
}