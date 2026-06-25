import {
  Actor,
  Engine,
  Vector,
  DisplayMode,
  BoundingBox,
  Color,
  SolverStrategy,
  Timer,
  Scene,
  randomInRange,
} from "excalibur";
import { Resources, ResourceLoader } from "./resources.js";
import { Background } from "./background.js";
import { DoorTrigger } from "./doorTrigger.js";
import { Player } from "./player.js";
import { Dog } from "./dog.js";
import { EastMaze } from "./eastmaze.js";

export class EastWing extends Scene {
  isReal;
  addedRealDoor;
  constructor() {
    const sceneWidth = 2400;
    const sceneHeight = 700;
    super({
      width: sceneWidth,
      height: sceneHeight,
      color: Color.Black,
    });

    this.placedProps = [];
    this.sceneWidth = sceneWidth;
    this.sceneHeight = sceneHeight;
    this.addedRealDoor = false;
    this.fakeDoor = new DoorTrigger(
      920,
      130,
      150,
      50,
      "EW_Room2",
      500,
      467,
      "empty",
      true,
    );
  }

  onInitialize(engine) {
    this.location = engine.currentSceneName;

    this.add(new Background(this.sceneWidth, this.sceneHeight, this.location));

    this.player = new Player();
    this.add(this.player);

    this.dog = new Dog();
    this.dog.pos = this.player.pos;
    this.add(this.dog);

    this.camera.strategy.lockToActor(this.player);
    this.camera.strategy.limitCameraBounds(
      new BoundingBox(0, 0, this.sceneWidth + 200, this.sceneHeight + 200),
    );

    this.add(
      new DoorTrigger(2250, 350, 50, 150, "Cafetaria", 200, 950, "right", true),
    );

    this.add(
      new DoorTrigger(150, 350, 50, 150, "EastMaze", 1300, 5350, "left", true),
    );

    this.add(
      new DoorTrigger(528, 130, 150, 50, "EW_Room1", 500, 467, "up", true),
    );

    this.add(this.fakeDoor);

    this.add(
      new DoorTrigger(1480, 130, 150, 50, "EW_Room3_4", 500, 500, "up", false),
    );

    this.add(
      new DoorTrigger(1880, 130, 150, 50, "EW_Room3_4", 500, 500, "up", false),
    );
  }

  onActivate(ctx) {
    if (this.dog.wallCutscene && !this.addedRealDoor) {
      this.fakeDoor.location = 'up';
      this.fakeDoor.graphics.offset = new Vector(0, -30)
      this.addedRealDoor = true;
    }

    const spawn = ctx.data?.spawn ?? { x: 500, y: 467 };
    this.player.pos = new Vector(spawn.x, spawn.y);
    this.dog.pos = new Vector(spawn.x, spawn.y);
  }
}
