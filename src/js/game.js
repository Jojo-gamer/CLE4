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
import { EW_Room1, EW_Room2 } from './ew_room1_2.js'
import { EndScene } from './endscene.js'

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
      color: Color.Black,
    });
    this.lives = 5;
    this.start(ResourceLoader).then(() => this.startGame());
  }

  startGame() {
    this.setupLivesHud();
    this.updateLivesHud();
    this.addScenes();
    
    // Initial spawn
    this.spawn = { x: 640, y: 700 };
    this.goToScene("Reception", {
          sceneActivationData: {
            spawn: this.spawn,
          },
        });
  }

  addScenes() {
    this.addScene("Reception", new Reception());
    this.addScene("Cafetaria", new Cafetaria());
    this.addScene("GameOver", new GameOver());
    this.addScene("EastHall", new Easthall());
    this.addScene("EastMaze", new EastMaze());
    this.addScene("EastWing", new EastWing());
    this.addScene("EW_Room1", new EW_Room1());
    this.addScene("EW_Room2", new EW_Room2());
    this.addScene("CourtYard", new CourtYard());
    this.addScene("Endscene", new EndScene())
  }

  onPostUpdate(engine) {
    this.framecount++;
    if (this.framecount === 60) {
      this.framecount = 0;
      this.timer++;
      // console.log(this.timer);
    }
  }

  setupLivesHud() {
    const existingHud = document.getElementById("lives-hud");
    if (existingHud) {
      this.livesHud = existingHud;
      return;
    }
    const hud = document.createElement("div");
    hud.id = "lives-hud";
    hud.style.position = "absolute";
    hud.style.top = "20px";
    hud.style.right = "125px";
    hud.style.display = "flex";
    hud.style.gap = "10px";
    hud.style.zIndex = "1000";
    document.body.appendChild(hud);
    this.livesHud = hud;
  }

  updateLivesHud() {
    if (!this.livesHud) return;
    const lives = Math.max(0, Math.min(5, this.lives ?? 5));
    this.livesHud.innerHTML = "";
    for (let index = 0; index < 5; index++) {
      const heart = document.createElement("img");
      heart.src = index < lives ? "images/entities/UI/fullheart.png" : "images/entities/UI/emptyheart.png";
      heart.style.width = "40px";
      heart.style.height = "auto";
      this.livesHud.appendChild(heart);
    }
  }

  async resetGame() {
    this.timer = 0;
    this.framecount = 0;
    this.lives = 5;
    this.updateLivesHud();
    this.nextSpawn = { x: 640, y: 700 };

    this.player = null;
    this.dog = null;

    // Verwijder oude scenes
    const sceneNames = ["Reception", "Cafetaria", "EastHall", "EastMaze", "EastWing", "CourtYard", "EW_Room1", "EW_Room2"];
    sceneNames.forEach(name => this.removeScene(name));

    // Voeg nieuwe toe
    this.addScenes();

    await this.goToScene("Reception");
  }
}

new Game();