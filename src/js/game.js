import '../css/style.css'
import { Actor, Engine, Vector, DisplayMode, BoundingBox, SolverStrategy, Timer, Color } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Player } from './player.js'
import { Enemy } from './enemy.js'
import { Background } from './background.js'
import { DoorTrigger } from './doorTrigger.js'
import { Cafetaria } from './Cafetaria.js'
import { Easthall } from './easthall.js'
import { CourtYard } from './courtyard.js'
import { GameOver } from './gameover.js'
import { Reception } from './reception.js'

export class Game extends Engine {
    timer = 0;
    framecount = 0;

    constructor() {
        super({
            width: 1280,
            height: 720,
            maxFps: 60,
            backgroundColor: Color.Black,
            displayMode: DisplayMode.FitScreen,
            color: Color.Black
            // physics: {
            //     solver: SolverStrategy.Arcade,
            // }
        })
        this.lives = 5;
        this.start(ResourceLoader).then(() => this.startGame())
    }
    startGame() {
        this.setupLivesHud()
        this.updateLivesHud()

        this.addScene("Reception", new Reception())
        this.addScene("Cafetaria", new Cafetaria())
        this.addScene("GameOver", new GameOver())
        this.addScene("EastHall", new Easthall())

        // this.goToScene("Reception")

        this.player = new Player();
        this.add(this.player)

        this.player.pos = new Vector( 200, 200)

        this.addScene("CourtYard", new CourtYard())

        this.currentScene.camera.strategy.lockToActor(this.player)
        this.currentScene.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, 3000, 2000))

        this.add(new DoorTrigger(20, 100, 50, 50, "Cafetaria", 400, 600));
        this.add(new DoorTrigger(100, 0, 50, 50, "EastHall", 100, 100))
    }

    onPostUpdate(engine) {
        this.framecount++
        if (this.framecount === 60) {
            this.framecount = 0;
            this.timer++
            console.log(this.timer)
        }
    }

    setupLivesHud() {
        const existingHud = document.getElementById('lives-hud')
        if (existingHud) {
            this.livesHud = existingHud
            return
        }

        const hud = document.createElement('div')
        hud.id = 'lives-hud'

        hud.style.position = 'absolute';
        hud.style.top = '20px';
        hud.style.right = '20px';
        hud.style.display = 'flex';
        hud.style.gap = '10px';
        hud.style.zIndex = '1000';

        document.body.appendChild(hud)
        this.livesHud = hud
    }

    updateLivesHud() {
        if (!this.livesHud) {
            return
        }

        const lives = Math.max(0, Math.min(5, this.lives ?? 5))
        this.livesHud.innerHTML = ''

        for (let index = 0; index < 5; index++) {
            const heart = document.createElement('img')
            heart.src = index < lives ? 'images/entities/UI/fullheart.png' : 'images/entities/UI/emptyheart.png'
            heart.alt = index < lives ? 'Full heart' : 'Empty heart'

            heart.style.width = '40px';  // Verkleint het hartje (pas het getal aan naar wens!)
            heart.style.height = 'auto';

            this.livesHud.appendChild(heart)
        }
    }
}

new Game()
