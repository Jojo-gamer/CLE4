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
import { EastMaze} from './eastmaze.js'
import { EastWing } from './eastwing.js'
import { Message } from './message.js'
import { Crowbar } from './crowbar.js'
import { EW_Room1, EW_Room2 } from './ew_room1_2.js'

export class Game extends Engine {
    timer = 0;
    framecount = 0;
    collectedCrowbar = false;
    
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
        this.addScene("EastMaze", new EastMaze())
        this.addScene("EastWing", new EastWing())
        this.addScene("EW_Room1", new EW_Room1())
        this.addScene("EW_Room2", new EW_Room2())
        this.addScene("CourtYard", new CourtYard())

        // Zorg dat hij de eerste keer ook mooi in het midden spawnt
        this.nextSpawn = { x: 640, y: 700 };
        this.goToScene("Reception")

        this.add(new Crowbar)
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
            hud.style.right = '125px';
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
        async resetGame() {
        // 1. Reset algemene status
        this.timer = 0;
        this.framecount = 0;
        this.lives = 5;
        this.updateLivesHud();

        // 2. Zorg dat de Reception scene straks de juiste spawn gebruikt
        this.nextSpawn = { x: 640, y: 700 };

        // 3. VERWIJDER de oude scenes volledig uit het geheugen!
        // (Dit wist ook automatisch alle oude enemies én de oude player)
        this.removeScene("Reception");
        this.removeScene("Cafetaria");
        this.removeScene("EastHall");
        this.removeScene("EastMaze");
        this.removeScene("EastWing");
        this.removeScene("CourtYard");

        // 4. Maak compleet nieuwe, schone scenes aan
        // (Hierbij maakt Reception zelf een nieuwe Player aan op de nextSpawn positie)
        this.addScene("Reception", new Reception());
        this.addScene("Cafetaria", new Cafetaria());
        this.addScene("EastHall", new Easthall());
        this.addScene("EastMaze", new EastMaze());
        this.addScene("EastWing", new EastWing());
        this.addScene("CourtYard", new CourtYard());

        // 5. Stuur de game terug naar de Receptie EN WACHT TOT HIJ DAAR IS!
        await this.goToScene("Reception");
    }
}

new Game();

