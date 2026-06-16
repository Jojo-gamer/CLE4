import '../css/style.css'
import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer, SpriteSheet } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Player } from './player.js'
import { Enemy } from './enemy.js'
import { background } from './background.js'

export class Game extends Engine {

    constructor() {
        super({
            width: 1920,
            height: 1080,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen,
            // physics: {
            //     solver: SolverStrategy.Arcade,
            // }
        })
        this.start(ResourceLoader).then(() => this.startGame())
    }

    startGame() {
        const spriteSheet = SpriteSheet.fromImageSource({
            image: Resources.Tiles,
            grid: {
                spriteWidth: 16,
                spriteHeight: 16,
                columns: 10,
                rows: 10,
            }
        })
        this.add(new background(spriteSheet))
        this.player = new Player()
        this.add(this.player)

        this.currentScene.camera.strategy.lockToActor(this.player)
        this.currentScene.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, 3000, 2000))

            let enemyCount = 0
            const spawnTimer = new Timer({
                fcn: () => {
                    if(enemyCount < 10) {
                        this.add(new Enemy(this.player))
                        enemyCount++;
                    }
                },
                interval: 500,
                repeats: true,
            })
            this.addTimer(spawnTimer)
            // spawnTimer.start();
    }
}

new Game()
