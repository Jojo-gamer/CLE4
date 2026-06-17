import { Actor, CollisionType, Color, Keys, Ray, Sound, Vector } from "excalibur";
import { Resources } from "./resources";

export class Dog extends Actor {
    constructor() {
        super({
            width: 40,
            height: 50,
            pos: new Vector(0, 0),
            scale: new Vector(0.6, 0.6)
        })
    }

    onInitialize(engine) {
        this.actions.follow(this.scene.player, 75)
        this.body.collisionType = CollisionType.Passive
        this.graphics.use(Resources.DogFront.toSprite())
        this.player = this.scene.player
        this.dir = Vector.Right
    }

    onPreUpdate(engine) {
        if (this.player.dirUp) {
            this.dir = Vector.Up
            this.graphics.use(Resources.DogBack.toSprite())
        }
        if (this.player.dirDown) {
            this.dir = Vector.Down
            this.graphics.use(Resources.DogFront.toSprite())
        }
        if (this.player.dirLeft) {
            this.dir = Vector.Left
            this.graphics.use(Resources.DogSide.toSprite())
            this.graphics.flipHorizontal = true;
        }
        if (this.player.dirRight) {
            this.dir = Vector.Right
            this.graphics.use(Resources.DogSide.toSprite())
            this.graphics.flipHorizontal = false;
        }

        if (engine.input.keyboard.wasPressed(Keys.Space)) {
            const ray = new Ray(this.pos, this.dir);
            const hits = this.scene.physics.rayCast(ray, {
                searchAllColliders: false, // Stop direct bij het eerste doelwit
                maxDistance: 350,
                filter: (hit) => {
                    if (hit.collider.owner !== this.player && hit.collider.owner !== this) {
                        return true
                    }
                }
            });
            if (hits.length > 0) {
                const owner = hits[0].collider.owner
                if (!owner.isReal) {
                    owner.body.collisionType = CollisionType.Passive
                    owner.actions.fade(0.3, 1000)
                } else {
                    console.log('WOOF')
                    Resources.BarkSound.play()
                }
            }
        }
    }
}