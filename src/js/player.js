import { Actor, CollisionType, Color, Keys, Vector, SpriteSheet, Animation, range, FadeInOut, Label } from "excalibur"

import { Resources } from "./resources"

import { Enemy } from "./enemy";

import { Keyfragment } from "./keyfragment";

import { DoorTrigger } from "./doorTrigger";

import { Message } from "./message";

import { Dog } from "./dog";

import { Crowbar } from "./crowbar";



export class Player extends Actor {

    speed = 450

    keyfragmentCount = 0;



    //for sprite orientation

    dirUp;

    dirDown;

    dirLeft;

    dirRight;



    constructor() {

        super({

            width: 60,

            height: 100,

            color: Color.Black,
            z: 999
        })

        // this.body.mass = 10

        this.name = "player"

        this.body.collisionType = CollisionType.Active

        this.offset = new Vector(0, 25)

        this.isRayCastable = false;

       

       

        this.hasKeys = false;



        this.collider.useBoxCollider(40, 50, Vector.Half, new Vector(0, 50));

        this.events.on("collisionstart", (e) => {

    const target = e.other.owner;



    if (target instanceof Dog) {
    if (!target.follow) {
        target.follow = true;
        target.actions.follow(this, 75);
        
        if (this.scene && this.scene.door) {
            this.scene.door.triggerEnabled = true;
        }

        // ✅ Start de cutscene via de scene
        if (this.scene && this.scene.cutsceneTrigger) {
            this.scene.cutsceneTrigger.startStory(this.scene.engine, this);
        }
    }
}



    if (target instanceof Enemy) {

        if (target.body.collisionType === CollisionType.Active) {

            this.loseLife();

        }

    }



    if (target instanceof Keyfragment) {

        target.kill();

        this.keyfragmentCount++;

       

        // ✅ VEILIGHEIDSCHECK: Controleer of de scene bestaat en doorloop de lijst veilig

        if (this.keyfragmentCount >= 2) {

            if (this.scene && this.scene.actors) {

                for (let actor of this.scene.actors) {

                    // Nog een check of het echt een DoorTrigger is

                    if (actor instanceof DoorTrigger) {

                        actor.triggerEnabled = true;

                    }

                }
            }

            if (target instanceof Enemy) {
                if (target.body.collisionType === CollisionType.Active) {
                    this.loseLife();
                }
            }

            if (target instanceof Keyfragment) {
                target.kill();
                this.keyfragmentCount++;

                // ✅ VEILIGHEIDSCHECK: Controleer of de scene bestaat en doorloop de lijst veilig
                if (this.keyfragmentCount >= 2) {
                    if (this.scene && this.scene.actors) {
                        this.scene.eastWingDoor.triggerEnabled = true;
                        this.scene.add(new Message());
                    }
                }
            }

            if (target instanceof Crowbar) {
                if (target.isReal && target.graphics.opacity > 0.7) {
                    this.gameEngine.collectedCrowbar = true;
                    this.scene.cafDoor.triggerEnabled = true;
                    console.log(this.gameEngine)
                    this.gameEngine.director.scenes.Cafetaria.courtyardDoor.triggerEnabled = true
                    target.kill();
                    this.scene.add(new Message());
                } else if (!target.isReal) {
                    target.kill();
                }
            }
        }
    }
        });
    }



    onInitialize(engine) {







        this.pathContacts = 0;



        this.spawnPoint = new Vector(this.pos.x, this.pos.y)



        this.gameEngine = engine



        if (this.gameEngine.lives === undefined) {

            this.gameEngine.lives = 5

        }



        this.lives = this.gameEngine.lives

        if (this.gameEngine.updateLivesHud) {

            this.gameEngine.updateLivesHud()

        }



        //Importing Spritesheets

        const playerUp = SpriteSheet.fromImageSource({

            image: Resources.SackUp,

            grid: { rows: 1, columns: 4, spriteWidth: 60, spriteHeight: 100 }

        })



        const playerDown = SpriteSheet.fromImageSource({

            image: Resources.SackDown,

            grid: { rows: 1, columns: 4, spriteWidth: 60, spriteHeight: 100 }

        })



        const playerHorizontal = SpriteSheet.fromImageSource({

            image: Resources.SackHorizontal,

            grid: { rows: 1, columns: 4, spriteWidth: 60, spriteHeight: 100 }

        })



        const movingDown = Animation.fromSpriteSheet(playerDown, range(0, 3), 160)

        const movingUp = Animation.fromSpriteSheet(playerUp, range(0, 3), 160)

        const movingHorizontal = Animation.fromSpriteSheet(playerHorizontal, range(0, 3), 160)



        const idleDown = playerDown.getSprite(0, 0)

        const idleUp = playerUp.getSprite(0, 0)

        const idleHorizontal = playerHorizontal.getSprite(0, 0)



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

        this.dirRight = false;



    }



    onPreUpdate(engine, delta) {

        
        

        let xVel = 0;

        let yVel = 0;


        if (this.isCutscenePlaying) {
        this.vel = Vector.Zero;
        return; // Stop hier met de rest van de code
    }


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

        // if (engine.input.keyboard.wasReleased(Keys.D)) {

        //     console.log(this.pos)

        // }



        if (engine.input.keyboard.isHeld(Keys.S)) {

            yVel = this.speed;

            this.dirDown = true;

            this.dirUp = false;



        }



        if (engine.input.keyboard.wasPressed(Keys.E)) {

            console.log(this.pos)

        }







        //Change sprite depending on movement and direction

        if (this.dirUp) {

            if (yVel < 0 && xVel == 0) {

                this.dirLeft = false;

                this.dirRight = false;

                this.graphics.use(this.movingUp)

                this.z = 1

            } else {

                this.graphics.use(this.idleUp)

            }

        }



        if (this.dirDown) {

            if (yVel > 0 && xVel == 0) {

                this.dirLeft = false;

                this.dirRight = false;

                this.graphics.use(this.movingDown)

                this.z = 2

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



        if (engine.input.keyboard.wasPressed(Keys.P)) {

            Resources.DogPet.play()

        }

    }



    loseLife(e) {

        if (this.isInvulnerable) return;



        this.isInvulnerable = true

        this.gameEngine.lives--

        this.lives = this.gameEngine.lives



        if (this.gameEngine.updateLivesHud) {

            this.gameEngine.updateLivesHud()

        }



        if (this.gameEngine.lives <= 0) {

            this.gameOver();

        } else {

            this.actions.blink(150, 100, 4).callMethod(() => {

                this.isInvulnerable = false

            })

        }

    }



    // respawn() {

    //     this.pos = new Vector(this.spawnPoint.x, this.spawnPoint.y)

    //     this.vel = new Vector(0, 0)

    // }



    gameOver() {
        this.scene.engine.isGameOver = true;

        // ✅ Kill the dog so it stops processing input
        this.scene.actors
            .filter(a => a.constructor.name === 'Dog')
            .forEach(a => a.kill());

        this.gameEngine.lives = 5;


        this.lives = 5;
        this.isInvulnerable = false;
        this.keyfragmentCount = 0;

        if (this.gameEngine.updateLivesHud) {
            this.gameEngine.updateLivesHud();
        }

        Resources.BarkSound.stop();

        this.scene.engine.goToScene("GameOver", {
            sceneActivationData: { TimeScore: this.scene.engine.timer },
            destinationIn: new FadeInOut({ duration: 2000, direction: 'in' })
        })
    }
}