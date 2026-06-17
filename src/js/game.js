import '../css/style.css'
import { Actor, Engine, Vector, DisplayMode, BoundingBox, SolverStrategy, Timer, Color } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Player } from './player.js'
import { Enemy } from './enemy.js'
import { Background } from './background.js'
import { DoorTrigger } from './doorTrigger.js'
import { Cafetaria } from './Cafetaria.js'

export class Game extends Engine {

    constructor() {
        super({
            width: 1920,
            height: 1080,
            maxFps: 60,
            backgroundColor: Color.Black,
            displayMode: DisplayMode.FitScreen,
        })
        this.start(ResourceLoader).then(() => this.startGame())
    }
    startGame() {
        this.addScene("Cafetaria", new Cafetaria())

        this.player = new Player();
        this.add(this.player)

        this.currentScene.camera.strategy.lockToActor(this.player)
        this.currentScene.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, 3000, 2000))

        this.add(new DoorTrigger(20, 100, 50, 50, "Cafetaria", 400, 600));

    }
}

new Game()
