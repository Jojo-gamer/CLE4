import '../css/style.css'
import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Player } from './player.js'
import { Enemy } from './enemy.js'
import { background } from './background.js'
import { DoorTrigger } from './doorTrigger.js'
import { Cafetaria } from './Cafetaria.js'
import { Easthall } from './easthall.js'

export class Game extends Engine {

    constructor() {
        super({
            width: 1920,
            height: 1080,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen,
            color: Color.Black
            // physics: {
            //     solver: SolverStrategy.Arcade,
            // }
        })
        this.start(ResourceLoader).then(() => this.startGame())
    }

    startGame() {
        this.addScene("Cafetaria", new Cafetaria())
        this.addScene("EastHall", new Easthall())


        this.add(new background())
        this.player = new Player()
        this.add(this.player)

        this.player.pos = new Vector( 200, 200)

        this.currentScene.camera.strategy.lockToActor(this.player)
        this.currentScene.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, 3000, 2000))

        this.add(new DoorTrigger(0, 70, 50,50,"Cafetaria", 400, 600));
        this.add(new DoorTrigger(100, 0, 50, 50, "EastHall", 100, 100))
        

            // let enemyCount = 0
            // const spawnTimer = new Timer({
            //     fcn: () => {
            //         if(enemyCount < 10) {
            //             this.add(new Enemy(this.player))
            //             enemyCount++;
            //         }
            //     },
            //     interval: 500,
            //     repeats: true,
            // })
            // this.addTimer(spawnTimer)
            // spawnTimer.start();
    }
}

new Game()
