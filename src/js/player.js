import { Actor, CollisionType, Color, Keys, Vector, SpriteSheet, Animation, range } from "excalibur"
import { Resources } from "./resources"

export class Player extends Actor {
    speed = 450

    //for sprite orientation
    dirUp;
    dirDown;
    dirLeft;
    dirRight;

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
        //Importing Spritesheets
        const playerUp = SpriteSheet.fromImageSource({
            image: Resources.SackUp,
            grid: {rows:1, columns: 4, spriteWidth: 60, spriteHeight: 100}
        })

        const playerDown = SpriteSheet.fromImageSource({
            image: Resources.SackDown,
            grid: {rows:1, columns: 4, spriteWidth: 60, spriteHeight: 100}
        })

        const playerHorizontal = SpriteSheet.fromImageSource({
            image: Resources.SackHorizontal,
            grid: {rows:1, columns: 4, spriteWidth: 60, spriteHeight: 100}
        })

        const movingDown = Animation.fromSpriteSheet(playerDown, range(0,3), 160)
        const movingUp = Animation.fromSpriteSheet(playerUp, range(0,3), 160)
        const movingHorizontal = Animation.fromSpriteSheet(playerHorizontal, range(0,3), 160)

        const idleDown = playerDown.getSprite(0,0)
        const idleUp = playerUp.getSprite(0,0)
        const idleHorizontal = playerHorizontal.getSprite(0,0)

        this.graphics.add("movingDown", movingDown)
        this.graphics.add("movingUp", movingUp)
        this.graphics.add("movingHorizontal", movingHorizontal)
        
        this.graphics.add("idleDown", idleDown)
        this.graphics.add("idleUp", idleUp)
        this.graphics.add("idleHorizontal", idleHorizontal)

        this.movingDown = this.graphics.use(movingDown)
        this.movingUp = this.graphics.use(movingUp)
        this.movingHorizontal = this.graphics.use(movingHorizontal)

        this.idleDown = this.graphics.use(idleDown)
        this.idleUp = this.graphics.use(idleUp)
        this.idleHorizontal = this.graphics.use(idleHorizontal)
        
        //Variables to determine sprite orientation
        this.dirUp = false;
        this.dirDown = false;
        this.dirLeft = false;
        this.dirLeft = false;

        this.pos = new Vector(100, 100)
    }

    onPreUpdate(engine, delta) {
        let xVel = 0;
        let yVel = 0;

        
        if (engine.input.keyboard.isHeld(Keys.W)) {
            yVel = -this.speed;
            this.dirUp = true;
            this.dirDown = false;
        } 

        if (engine.input.keyboard.isHeld(Keys.A)) {
            xVel = -this.speed;
            this.dirLeft = true;
            this.dirRight = false;
        } 

        if (engine.input.keyboard.isHeld(Keys.D)) {
            xVel = this.speed;
            this.dirRight = true;
            this.dirLeft = false;
        } 

        if (engine.input.keyboard.isHeld(Keys.S)) {
            yVel = this.speed;
            this.dirDown = true;
            this.dirUp = false;
        }

        if (engine.input.keyboard.wasReleased(Keys.D)) {
            this.dirRight = false;
        }

        if (engine.input.keyboard.wasReleased(Keys.A)) {
            this.dirLeft = false;
        }

        //Change sprite depending on movement and direction
        if (this.dirUp) {
            if (yVel < 0 && xVel == 0) {
                this.graphics.use(this.movingUp)
            } else {
                this.graphics.use(this.idleUp)
            }
        }

        if (this.dirDown) {
            if (yVel > 0 && xVel == 0) {
                this.graphics.use(this.movingDown)
            } else {
                this.graphics.use(this.idleDown)
            }
        }

         if (this.dirRight) {
            if (xVel > 0) {
                this.graphics.use(this.movingHorizontal)
                this.graphics.flipHorizontal = false;
            } else {
                this.graphics.use(this.idleHorizontal)
            }
        }

        if (this.dirLeft) {
            if (xVel < 0) {
                this.graphics.use(this.movingHorizontal)
                this.graphics.flipHorizontal = true;
            } else {
                this.graphics.use(this.idleHorizontal)
            }
        }

        
    

        this.vel = new Vector(xVel, yVel)
    }
}