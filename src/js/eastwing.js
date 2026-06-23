import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer, Scene, randomInRange } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Background } from "./background.js"
import { DoorTrigger } from "./doorTrigger.js";
import { Player } from "./player.js";
import { Dog } from './dog.js'

export class EastWing extends Scene {
    isReal;

    constructor() {
        const sceneWidth = 2400
        const sceneHeight = 700 
        super({
             width: sceneWidth,
            height: sceneHeight,
            color: Color.Black
        });
        
        this.placedProps = [];
        this.sceneWidth = sceneWidth
        this.sceneHeight = sceneHeight
    }

    onInitialize() {
         this.add(new Background(this.sceneWidth, this.sceneHeight))

         this.player = new Player();
                 const spawnPoint = this.engine.nextSpawn
                 this.player.pos = new Vector(spawnPoint.x, spawnPoint.y)
                 this.add(this.player);
         
                 this.dog = new Dog()
                 this.dog.pos = this.player.pos
                 this.add(this.dog)

                 this.camera.strategy.lockToActor(this.player)
                 this.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, this.sceneWidth + 200, this.sceneHeight + 200))

                 this.add(new DoorTrigger(2250, 350, 50, 150, "Cafetaria", 200, 960, true));
        
    }
}