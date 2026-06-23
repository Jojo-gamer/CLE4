import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer, Scene, randomInRange } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Background } from "./background.js"
import { DoorTrigger } from "./doorTrigger.js";
import { Player } from "./player.js";
import { TableVertical } from "./tablevertical.js";
import { TableHorizontal } from "./tablehorizontal.js";
import { Dog } from './dog.js'
import { Enemy } from "./enemy.js";

export class CourtYard extends Scene {
    constructor() {
        super();
    }
    onInitialize() {
        this.player = new Player();
        const spawnPoint = this.engine.nextSpawn
        this.player.pos = new Vector(spawnPoint.x, spawnPoint.y)
        this.add(this.player);

        this.dog = new Dog()
        this.dog.pos = this.player.pos
        this.add(this.dog)


        this.camera.strategy.lockToActor(this.player)
        this.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, 3000, 2000))

        
        this.add(new DoorTrigger(1500, 2000, 150, 50, "Cafetaria", 1500, 150));

    }
}