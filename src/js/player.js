import { Actor, CollisionType, Color, Keys, Vector } from "excalibur"

export class Player extends Actor {
    speed = 450

    constructor() {
        super({
            width: 60,
            height: 100,
            color: Color.Black
        })
        // this.body.mass = 10
        this.body.collisionType = CollisionType.Active
    }

    onInitialize(engine) {
        this.pos = new Vector(100, 100)
    }

    onPreUpdate(engine, delta) {
        let xVel = 0;
        let yVel = 0;

        if (engine.input.keyboard.isHeld(Keys.W)) {
            yVel = -this.speed;
        }
        if (engine.input.keyboard.isHeld(Keys.A)) {
            xVel = -this.speed;
        }
        if (engine.input.keyboard.isHeld(Keys.D)) {
            xVel = this.speed;
        }
        if (engine.input.keyboard.isHeld(Keys.S)) {
            yVel = this.speed;
        }

        this.vel = new Vector(xVel, yVel)
    }
}