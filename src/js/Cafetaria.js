import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer, Scene, randomInRange } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { background } from "./background.js"
import { DoorTrigger } from "./doorTrigger.js";
import { Player } from "./player.js";

export class Cafetaria extends Scene {
    constructor() {
        super({
            width: 800,
            height: 1000,
            color: Color.Black
        }
        );

    }
    onInitialize() {

        this.add(new background())

        this.player = new Player();

        const spawnPoint = this.engine.nextSpawn

        console.log(spawnPoint.x)
        console.log(spawnPoint.y)

        this.player.pos = new Vector(spawnPoint.x,spawnPoint.y)

        this.add(this.player);

        this.events.on("exitviewport", (e) => this.playerLeft(e))
        
                this.camera.strategy.lockToActor(this.player)
                this.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, 3000, 2000))
                


        //const tableH1 = new TableHorizontal()
        //const tableV1 = new TableVertical()

        //tableH1.pos = new Vector(randomInRange(60, 2500),randomInRange(40, 1400))
        //tableV1.pos = new Vector(randomInRange(60, 2500),randomInRange(40, 1400))

        //this.add(tableH1)
        //this.add(tableV1)



    }


    playerLeft (e) {
        // omhoog er uit
        if (e.target.pos.y < 5) {
            // animation fade out
            // kill player sprite
            //this.engine.goToScene(Courtyard)
        }
        // links er uit
        if (e.target.pos.x < 5) {
            // animation fade out
            // kill player sprite
            //this.engine.goToScene(EastWing)
        }
        // rechts er uit
        if (e.target.pos.x > 800) {
            // animation fade out
            // kill player sprite
            //this.engine.goToScene(WestWing)
        }




        
    }
}