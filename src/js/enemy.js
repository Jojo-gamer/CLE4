import { Actor, CollisionType, Color, randomIntInRange, Vector } from "excalibur";

export class Enemy extends Actor {
    constructor(player) {
        super({
            width: 40,
            height: 40,
            color: Color.Green,
        })
        this.player = player
        this.body.collisionType = CollisionType.Active
    }

    onInitialize(engine) {
        this.spawn()
    }

    onPreUpdate(engine) {
        const direction = this.player.pos.sub(this.pos).normalize() // sub is subtraction, normalize zet een vector om naar een vector met lengte 1, maar met dezelfde richting.
        const speed = 300 // pixels per seconde
        this.vel = direction.scale(speed) // scale verm. de vector met de speed
    }

    spawn() {
        this.pos = new Vector(randomIntInRange(0, 3000), randomIntInRange(0, 2000))
        if (this.player.pos.distance(this.pos) <= 700) this.spawn();
    }
}