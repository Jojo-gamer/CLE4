import { Actor, CollisionType, Color, randomIntInRange, SpriteSheet, Vector } from "excalibur";
import { Player } from "./player";
import { Resources } from "./resources";

export class Enemy extends Actor {
    //Variable to stop moving once making contact with player
    #playerContact;
    #counter;
    isReal;

    constructor(isReal) {
        super({
            width: 40,
            height: 70,
            color: Color.Green,
            z: 2
        })
        this.isRayCastable = true;
        this.isReal = isReal;
        this.body.collisionType = CollisionType.Active

    }

    onInitialize(engine) {
        const knightUp = SpriteSheet.fromImageSource({
            image: Resources.KnightFront,
            grid: { rows: 1, columns: 1, spriteWidth: 640, spriteHeight: 640 }
        })

        const knightSide = SpriteSheet.fromImageSource({
            image: Resources.KnightSide,
            grid: { rows: 1, columns: 1, spriteWidth: 640, spriteHeight: 640 }
        })

        const knightBack = SpriteSheet.fromImageSource({
            image: Resources.KnightBack,
            grid: { rows: 1, columns: 1, spriteWidth: 640, spriteHeight: 640 }
        })

        const idleFront = knightUp.getSprite(0, 0)
        const idleSide = knightSide.getSprite(0, 0)
        const idleBack = knightBack.getSprite(0, 0)

        this.graphics.add('idleFront', idleFront)
        this.graphics.add('idleSide', idleSide)
        this.graphics.add('idleBack', idleBack)

        this.idleFront = this.graphics.use(idleFront)
        this.idleSide = this.graphics.use(idleSide)
        this.idleBack = this.graphics.use(idleBack)

        this.idleFront.scale = new Vector(0.25, 0.25)
        this.idleSide.scale = new Vector(0.25, 0.25)
        this.idleBack.scale = new Vector(0.25, 0.25)

        this.anchor = new Vector(0.5, 0.67)

        this.spawn()
        this.playerContact = false;
        this.counter = 0;

        this.on('collisionstart', (e) => this.hitPlayer(e))
    }


    onPostUpdate(engine) {
        const direction = this.scene.player.pos.sub(this.pos).normalize() // sub is subtraction, normalize zet een vector om naar een vector met lengte 1, maar met dezelfde richting.
        const speed = 100 // pixels per seconde

        //Sprite Logic

        if (this.vel.y > 0) {
            if (this.vel.x < 40 && this.vel.x > -40) {
                this.graphics.use(this.idleFront)
            } else if (this.vel.x > 40) {
                this.graphics.use(this.idleSide)
                this.graphics.flipHorizontal = false;
            } else if (this.vel.x < -40) {
                this.graphics.use(this.idleSide)
                this.graphics.flipHorizontal = true;
            }
        }

        if (this.vel.y < 0) {
            if (this.vel.x < 40 && this.vel.x > -40) {
                this.graphics.use(this.idleBack)
            } else if (this.vel.x > 40) {
                this.graphics.use(this.idleSide)
                this.graphics.flipHorizontal = false;
            } else if (this.vel.x < -40) {
                this.graphics.use(this.idleSide)
                this.graphics.flipHorizontal = true;
            }
        }

        if (!this.playerContact) {
            this.vel = direction.scale(speed)
        }

        if (this.playerContact) {
            this.vel = direction.scale(0)
            engine.clock.schedule(() => { this.playerContact = false }, 800)
        }

    }

    spawn() {
        this.pos = new Vector(randomIntInRange(300, this.scene.sceneWidth - 300), randomIntInRange(300, this.scene.sceneHeight - 300))
        console.log(this.pos)
        if (this.scene.player.pos.distance(this.pos) <= 700) this.spawn();
    }

    hitPlayer(e) {
        if (e.other.owner instanceof Player) {
            this.playerContact = true;
        }
    }
}