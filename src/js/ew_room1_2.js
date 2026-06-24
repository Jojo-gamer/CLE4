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
                 const spawnPoint = this.engine.nextSpawn
                 this.player.pos = new Vector(spawnPoint.x, spawnPoint.y)
                 this.add(this.player);
         
                 this.dog = new Dog()
                 this.dog.pos = this.player.pos
                 this.add(this.dog)

                 this.camera.strategy.lockToActor(this.player)
                 this.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, 1280, 720))

                 this.add(new DoorTrigger(500,567,150,50,"EastWing",528,130, 'down', true))
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
                 const spawnPoint = this.engine.nextSpawn
                 this.player.pos = new Vector(spawnPoint.x, spawnPoint.y)
                 this.add(this.player);
         
                 this.dog = new Dog()
                 this.dog.pos = this.player.pos
                 this.add(this.dog)

                 this.camera.strategy.lockToActor(this.player)
                 this.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, 1280, 720))

                 this.add(new DoorTrigger(500,567,150,50,"EastWing",920,130, 'down', true))
    }
}