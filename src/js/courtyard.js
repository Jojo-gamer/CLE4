import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer, Scene, randomInRange } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Background } from "./background.js"
import { DoorTrigger } from "./doorTrigger.js";
import { Player } from "./player.js";
import { Dog } from './dog.js'
import { Enemy } from "./enemy.js";

export class CourtYard extends Scene {
    constructor() {
        const sceneWidth = 3000
        const sceneHeight = 2000
        super({
            width: sceneWidth,
            height: sceneHeight,
        })

        this.sceneWidth = sceneWidth
        this.sceneHeight = sceneHeight
    }
    onInitialize(engine) {
        this.background = new Background(this.sceneWidth, this.sceneHeight, engine.currentSceneName)
        this.add(this.background)

        this.player = new Player();
        const spawnPoint = this.engine.nextSpawn
        this.player.pos = new Vector(spawnPoint.x, spawnPoint.y)
        this.add(this.player);

        this.dog = new Dog()
        this.dog.pos = this.player.pos
        this.add(this.dog)


        this.camera.strategy.lockToActor(this.player)
        this.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, this.sceneWidth, this.sceneHeight))


        this.add(new DoorTrigger(1500, 1860, 150, 50, "Cafetaria", 1500, 150, 'down'));

    }
}