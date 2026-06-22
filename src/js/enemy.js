import { Actor, CollisionType, Color, randomIntInRange, Vector } from "excalibur";
import { Player } from "./player";

export class Enemy extends Actor {
    //Variable to stop moving once making contact with player
    #playerContact;
    #counter;
    isReal = true;

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
        this.playerContact = false;
        this.counter = 0;

        this.on('collisionstart', (e) => this.hitPlayer(e))
    }


    onPostUpdate(engine) {
        const direction = this.scene.player.pos.sub(this.pos).normalize() // sub is subtraction, normalize zet een vector om naar een vector met lengte 1, maar met dezelfde richting.
        const speed = 200 // pixels per seconde

        if (!this.playerContact) {
            this.vel = direction.scale(speed)
        }

        if (this.playerContact) {
            this.vel = direction.scale(0)
            engine.clock.schedule(() => {this.playerContact = false}, 800)
        }

}

        



    spawn() {
        this.pos = new Vector(randomIntInRange(200, 2500), randomIntInRange(300, 1500))
        if (this.scene.player.pos.distance(this.pos) <= 700) this.spawn();
    }

    hitPlayer(e) {
        if (e.other.owner instanceof Player) {
            this.playerContact = true;
        }
    }
}