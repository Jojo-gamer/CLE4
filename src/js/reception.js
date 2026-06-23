import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer, Scene, randomInRange } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Background } from "./background.js"
import { DoorTrigger } from "./doorTrigger.js";
import { Player } from "./player.js";
import { TableVertical } from "./tablevertical.js";
import { TableHorizontal } from "./tablehorizontal.js";
import { Dog } from './dog.js'
import { Enemy } from "./enemy.js";

export class Reception extends Scene {
    constructor() {
        const sceneWidth = 1000
        const sceneHeight = 1000

        super({
            width: sceneWidth,
            height: sceneHeight,
            color: Color.Black,
        });

        this.sceneWidth = sceneWidth
        this.sceneHeight = sceneHeight

    }

    onInitialize(engine) {
        this.add(new Background(this.sceneWidth, this.sceneHeight))

        this.player = new Player();
                const spawnPoint = this.engine.nextSpawn
                this.player.pos = new Vector (900, 200)

                this.player.pos = new Vector(spawnPoint.x, spawnPoint.y)
                this.add(this.player);

                this.add(new DoorTrigger(500,  150, 150, 50, "Cafetaria", 1500, 1750));

    }

}