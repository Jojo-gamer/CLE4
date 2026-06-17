import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer, Scene, randomInRange } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { background } from "./background.js"
import { DoorTrigger } from "./doorTrigger.js";
import { Player } from "./player.js";
import { TableVertical } from "./tablevertical.js";
import { TableHorizontal } from "./tablehorizontal.js";

export class Cafetaria extends Scene {
    constructor() {
        super({
            width: 800,
            height: 1000,
            color: Color.Black
        }
        );super();

    }
    onInitialize() {

        this.add(new background())

        this.player = new Player();

        const spawnPoint = this.engine.nextSpawn

        

        console.log(spawnPoint.x)
        console.log(spawnPoint.y)

        this.player.pos = new Vector(spawnPoint.x,spawnPoint.y)

        this.add(this.player);

        const tV1 = new TableVertical(); tV1.pos = new Vector(randomInRange(100, 1000), randomInRange(100, 1000)); this.add(tV1); 
        const tV2 = new TableVertical(); tV2.pos = new Vector(randomInRange(100, 1000), randomInRange(100, 1000)); this.add(tV2); 
        const tV3 = new TableVertical(); tV3.pos = new Vector(randomInRange(100, 1000), randomInRange(100, 1000)); this.add(tV3); 
        const tV4 = new TableVertical(); tV4.pos = new Vector(randomInRange(100, 1000), randomInRange(100, 1000)); this.add(tV4);


        const tH1 = new TableHorizontal(); tH1.pos = new Vector(randomInRange(100, 1000), randomInRange(100, 1000)); this.add(tH1); 
        const tH2 = new TableHorizontal(); tH2.pos = new Vector(randomInRange(100, 1000), randomInRange(100, 1000)); this.add(tH2); 
        const tH3 = new TableHorizontal(); tH3.pos = new Vector(randomInRange(100, 1000), randomInRange(100, 1000)); this.add(tH3); 
        const tH4 = new TableHorizontal(); tH4.pos = new Vector(randomInRange(100, 1000), randomInRange(100, 1000)); this.add(tH4);

        

        this.add(new background())
                this.player = new Player()
                this.add(this.player)
        
                this.camera.strategy.lockToActor(this.player)
                this.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, 3000, 2000))
                


        



    }


    
}