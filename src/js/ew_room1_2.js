import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer, Scene, randomInRange, TileMap } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Background } from "./background.js"
import { DoorTrigger } from "./doorTrigger.js";
import { Player } from "./player.js";
import { Dog } from './dog.js'

export class EW_Room1 extends Scene {
    isReal;

    constructor() {
        const sceneWidth = 1000
        const sceneHeight = 700
        super ({
            width: sceneWidth,
            height: sceneHeight,
            color: Color.Black
        })

        this.placedProps = [];
        this.sceneWidth = sceneWidth
        this.sceneHeight = sceneHeight
    }

    onInitialize(engine) {
        this.location = engine.currentSceneName

        this.add(new Background(this.sceneWidth, this.sceneHeight, this.location))


        this.player = new Player();
                 let spawnPoint = this.engine.nextSpawn
                 this.player.pos = new Vector(spawnPoint.x, spawnPoint.y)
                 this.add(this.player);
         
                 this.dog = new Dog()
                 this.dog.pos = this.player.pos
                 this.add(this.dog)

                 this.camera.strategy.lockToActor(this.player)
                 this.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, 1280, 720))

                this.EWDoor1toWing = new DoorTrigger(500,567,150,50,"EastWing",528,130, 'down', true)
                this.EWDoor1to2 = new DoorTrigger(845,337,50,150,"EW_Room2",200,300, 'right', true)

                this.add(this.EWDoor1toWing)
                this.add(this.EWDoor1to2)
                
    }

    onActivate(ctx) {
        if (this.engine.currentSceneName == "EW_Room1") {
            console.log("Dicks")
            this.player.pos = new Vector(spawnPoint.x, spawnPoint.y)
                }
    }
}



export class EW_Room2 extends Scene {
    isReal;

    constructor() {
        const sceneWidth = 1000
        const sceneHeight = 700
        super ({
            width: sceneWidth,
            height: sceneHeight,
            color: Color.Black
        })

        this.placedProps = [];
        this.sceneWidth = sceneWidth
        this.sceneHeight = sceneHeight
    }

    onInitialize(engine) {
        this.location = engine.currentSceneName

        this.add(new Background(this.sceneWidth, this.sceneHeight, this.location))

        this.player = new Player();
                 let spawnPoint = this.engine.nextSpawn
                 this.player.pos = new Vector(spawnPoint.x, spawnPoint.y)
                 this.add(this.player);
         
                 this.dog = new Dog()
                 this.dog.pos = this.player.pos
                 this.add(this.dog)

                 this.camera.strategy.lockToActor(this.player)
                 this.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, 1280, 720))

                this.EWDoor2toWing = new DoorTrigger(500,567,150,50,"EastWing",920,130, 'down', true)
                this.EWDoor2to1 = new DoorTrigger(150,337,50,150,"EW_Room1",800,300, 'left', true)

                this.add(this.EWDoor2toWing)
                this.add(this.EWDoor2to1)
    }

    onActivate(ctx) {
        if (this.engine.currentSceneName == "EW_Room2") {
            console.log("Balls")
            this.player.pos = new Vector(spawnPoint.x, spawnPoint.y)
        }
    }
}