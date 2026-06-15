import '../css/style.css'
import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Player } from './player.js'
import { Tile } from './tile.js'

export class Game extends Engine {

    constructor() {
        super({
            width: 1920,
            height: 1080,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen,
            physics: {
                solver: SolverStrategy.Realistic,
            }
        })
        this.start(ResourceLoader).then(() => this.startGame())
    }

    startGame() {
        const tileSize = 64;
        const rows = 32;
        const cols = 47;
        let color = 1;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (color === 1) {
                    const tile = new Tile(col * tileSize, row * tileSize, Color.White);
                    this.add(tile);
                    color = 0;
                } else {
                    const tile = new Tile(col * tileSize, row * tileSize, Color.Gray);
                    this.add(tile);
                    color = 1;
                }
            }
        }
        const player = new Player()
        this.add(player)

        this.currentScene.camera.strategy.lockToActor(player)
        this.currentScene.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, 3000, 2000))
    }
}

new Game()
