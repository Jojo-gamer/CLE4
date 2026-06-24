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
  CollisionType,
} from "excalibur";
import { Resources, ResourceLoader } from "./resources.js";
import { Background } from "./background.js";
import { DoorTrigger } from "./doorTrigger.js";
import { Player } from "./player.js";
import { MazeTileCollisionBuilder } from "./collisionbuilder.js";
import { Dog } from "./dog.js";

export class Easthall extends Scene {
  constructor() {
    super({
      width: 4320,
      height: 1440,
      queueMicrotaskcolor: Color.Black,
    });
  }

  async onInitialize() {
    this.currentPathTile = null;
    const WORLD_WIDTH = 4320;
    const WORLD_HEIGHT = 1440;
    this.player = new Player();
    this.player.z = 999;
    const spawnPoint = this.engine.nextSpawn ?? { x: 300, y: 300 };
    const bgImg = Resources.EastHallMap.toSprite();

    this.player.pos = new Vector(spawnPoint.x, spawnPoint.y);
    this.add(this.player);
    this.camera.strategy.lockToActor(this.player);
    this.camera.strategy.limitCameraBounds(
      new BoundingBox(0, 0, WORLD_WIDTH, WORLD_HEIGHT),
    );

    const dog = new Dog();
    dog.z = 999;
    this.add(dog);

    const bg = new Actor({
      x: 0,
      y: 0,
      width: WORLD_WIDTH,
      height: WORLD_HEIGHT,
      anchor: Vector.Zero,
    });
    bgImg.scale = new Vector(
      WORLD_WIDTH / bgImg.width,
      WORLD_HEIGHT / bgImg.height,
    );
    bg.graphics.use(bgImg);
    this.add(bg);

    this.add(
      new Actor({
        x: 0,
        y: 0,
        width: WORLD_WIDTH,
        height: 1,
        anchor: Vector.Zero,
        collisionType: CollisionType.Fixed,
      }),
    );

    this.add(
      new Actor({
        x: WORLD_WIDTH - 90,
        y: 0,
        width: 90,
        height: WORLD_HEIGHT,
        anchor: Vector.Zero,
        collisionType: CollisionType.Fixed,
      }),
    );

    this.add(
      new Actor({
        x: 0,
        y: WORLD_HEIGHT - 1,
        width: WORLD_WIDTH,
        height: 1,
        anchor: Vector.Zero,
        collisionType: CollisionType.Fixed,
      }),
    );

    this.add(
      new Actor({
        x: 0,
        y: 0,
        width: 90,
        height: WORLD_HEIGHT,
        anchor: Vector.Zero,
        collisionType: CollisionType.Fixed,
      }),
    );

    this.player.on("collisionstart", (e) => {
      const floorTile = e.other.owner;
      if (floorTile.name === "path") {
        this.player.pathContacts++;
      }
    });

    this.player.on("collisionend", (e) => {
      const floorTile = e.other.owner;
      if (floorTile.name === "path") {
        this.player.pathContacts--;

        if (
          this.player.pathContacts === 0 &&
          this.player.pos.x >= 1000 &&
          this.player.pos.x <= 3800
        ) {
          this.player.loseLife();
          this.player.pos = new Vector(852, 710);
          dog.pos = new Vector(840, 710);
        }
      }
    });

    const doorHallway = new DoorTrigger(
      46,
      180,
      90,
      180,
      "EastHallway",
      1300,
      500,
      "left",
      true,
    );
    doorHallway.z = 10;
    this.add(doorHallway);

    const rects = await MazeTileCollisionBuilder.fromImage(
      "/images/East-hall-map.png",
      WORLD_WIDTH,
      WORLD_HEIGHT,
      {
        tileSize: 45,
        tolerance: 20,
        treatBlackAsCollision: false,
      },
    );

    const walls = MazeTileCollisionBuilder.createCollisionActors(
      rects,
      0,
      4150,
    );
    for (const wall of walls) {
      if (wall.pos.x >= 1080 && wall.pos.x <= 3600) {
        wall.graphics.use(Resources.floorTile.toSprite());
        if (Math.random() > 0.75) {
          wall.actions.fade(0.3, 100);
        }
      }
      wall.isReal = false;
      this.add(wall);
    }
  }
}
