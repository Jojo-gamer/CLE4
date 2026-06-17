import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer, Scene, randomInRange } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { background } from "./background.js"
import { TableVertical } from "./tablevertical.js";
import { TableHorizontal } from "./tablehorizontal.js";

export class Cafetaria extends Scene {
    constructor() {
        super();

    }
    onInitialize() {

        this.events.on("exitviewport", (e) => this.playerLeft(e))

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
        
                this.currentScene.camera.strategy.lockToActor(this.player)
                this.currentScene.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, 3000, 2000))
                


        const tableH1 = new TableHorizontal()
        const tableV1 = new TableVertical()

        tableH1.pos = new Vector(randomInRange(60, 2500),randomInRange(40, 1400))
        tableV1.pos = new Vector(randomInRange(60, 2500),randomInRange(40, 1400))

        this.add(tableH1)
        this.add(tableV1)



    }


    playerLeft (e) {
        // omhoog er uit
        if (e.target.pos.y < 5) {
            // animation fade out
            // kill player sprite
            this.engine.goToScene(Courtyard)
        }
        // links er uit
        if (e.target.pos.x < 5) {
            // animation fade out
            // kill player sprite
            this.engine.goToScene(EastWing)
        }
        // rechts er uit
        if (e.target.pos.x > 800) {
            // animation fade out
            // kill player sprite
            this.engine.goToScene(WestWing)
        }




        
    }
}