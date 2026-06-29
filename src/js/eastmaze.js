import {
  Actor,
  Vector,
  BoundingBox,
  Color,
  Scene,
  CollisionType,
  GraphicsGroup,
} from "excalibur";
import { Resources } from "./resources.js";
import { DoorTrigger } from "./doorTrigger.js";
import { Player } from "./player.js";
import { MazeWallCollisionBuilder } from "./mazecollisionbuilder.js";
import { Dog } from "./dog.js";
import { Enemy } from "./enemy.js";

const TILE_SIZE = 128;

export class EastMaze extends Scene {
  constructor() {
    super({
      width: 1440,
      height: 5760,
      color: Color.Black,
    });
  }

  async onInitialize() {
    const WORLD_WIDTH = 1440;
    const WORLD_HEIGHT = 5760;
    const MAP_WIDTH = 256;
    const MAP_HEIGHT = 1024;
    const MAP_SCALE = WORLD_WIDTH / MAP_WIDTH;

    // ==========================================
    // DE MAGISCHE TRUC VOOR DE ENEMY SPAWN
    // ==========================================
    Enemy.prototype.spawn = function () {
      if (!this.scene) return;

      let validSpawn = false;
      let attempts = 0;

      while (!validSpawn && attempts < 100) {
        const randomX = Math.floor(Math.random() * (WORLD_WIDTH - 200)) + 100;
        const randomY = Math.floor(Math.random() * (WORLD_HEIGHT - 200)) + 100;
        this.pos = new Vector(randomX, randomY);

        if (
          this.scene.player &&
          this.scene.player.pos.distance(this.pos) <= 700
        ) {
          attempts++;
          continue;
        }

        const inWall = this.scene.actors.some(
          (actor) =>
            actor !== this &&
            actor.isReal !== undefined &&
            !(actor instanceof Enemy) &&
            actor.collider &&
            actor.collider.bounds.contains(this.pos),
        );

        if (!inWall) {
          validSpawn = true;
        }
        attempts++;
      }
    };
    // ==========================================

    this.player = new Player();
    this.player.z = 998;

    this.add(new DoorTrigger(1416, 350, 50, 150, "EastHall", 142, 152));
    this.add(new DoorTrigger(1400, 5350, 50, 150, "EastWing", 230, 350));

    this.dog = new Dog();
    this.dog.z = 999;
    this.dog.pos = this.player.pos;
    this.add(this.dog);

    this.camera.strategy.lockToActor(this.player);
    this.camera.strategy.limitCameraBounds(
      new BoundingBox(0, 0, WORLD_WIDTH, WORLD_HEIGHT),
    );

    const borderWalls = [
      new Actor({
        x: 0,
        y: -10,
        width: WORLD_WIDTH,
        height: 10,
        anchor: Vector.Zero,
        collisionType: CollisionType.Fixed,
      }),
      new Actor({
        x: 0,
        y: WORLD_HEIGHT,
        width: WORLD_WIDTH,
        height: 10,
        anchor: Vector.Zero,
        collisionType: CollisionType.Fixed,
      }),
      new Actor({
        x: -10,
        y: 0,
        width: 10,
        height: WORLD_HEIGHT,
        anchor: Vector.Zero,
        collisionType: CollisionType.Fixed,
      }),
      new Actor({
        x: WORLD_WIDTH,
        y: 0,
        width: 10,
        height: WORLD_HEIGHT,
        anchor: Vector.Zero,
        collisionType: CollisionType.Fixed,
      }),
    ];
    for (const wall of borderWalls) this.add(wall);

    const bg = new Actor({
      x: 0,
      y: 0,
      width: WORLD_WIDTH,
      height: WORLD_HEIGHT,
      anchor: Vector.Zero,
    });
    const bgImg = Resources.EastHallWay.toSprite();
    bgImg.scale = new Vector(
      WORLD_WIDTH / bgImg.width,
      WORLD_HEIGHT / bgImg.height,
    );
    bg.graphics.use(bgImg);
    this.add(bg);

    const rects = await MazeWallCollisionBuilder.fromImage(
      "./images/east-maze.png",
      MAP_WIDTH,
      MAP_HEIGHT,
      {
        tileSize: 4,
        scale: MAP_SCALE,
        treatGreenAsCollision: true,
        greenIsSolid: true,
        treatBlackAsCollision: true,
        blackIsSolid: false,
      },
    );

    const walls = MazeWallCollisionBuilder.createCollisionActors(rects);

    for (const wall of walls) {
      wall.z = 1;
      this.add(wall);

      // GEWIJZIGD: We maken de hitbox NIET onzichtbaar, maar plakken de graphics er direct op!
      this.applyTiledGraphics(wall);
    }
  }

  onActivate(ctx) {
    // 1. Haal de centrale speler op
    if (!this.engine.player) {
      this.engine.player = new Player();
    }
    this.player = this.engine.player;

    // 2. Voeg de speler toe als hij er nog niet in zit
    if (!this.player.scene) {
      this.add(this.player);
    }

    // 3. Speler positie
    const spawn = ctx.data?.spawn ?? { x: 400, y: 500 };
    this.player.pos = new Vector(spawn.x, spawn.y);
    this.dog.pos = new Vector(spawn.x, spawn.y);

    // 4. Hond setup (haal uit engine of maak aan)
    if (!this.engine.dog) {
      this.engine.dog = new Dog(true); // Zet follow op true
    }
    this.dog = this.engine.dog;

    if (!this.dog.scene) {
      this.add(this.dog);
    }
    this.dog.pos = this.player.pos;

    // ✅ DE BELANGRIJKSTE STAP: 
    // Forceer de hond om de speler weer te gaan volgen in deze nieuwe scene
    this.dog.actions.clearActions();
    this.dog.actions.follow(this.player, 75);

    // Camera
    this.camera.strategy.lockToActor(this.player);
    this.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, 1440, 5760));
  }

  onDeactivate(ctx) {
    this.killEnemies();
  }

  // GEWIJZIGD: In plaats van losse actors aan de scene toe te voegen,
  // bundelen we de sprites en koppelen we ze direct aan de muur (wall).
  applyTiledGraphics(wall) {
    const w = wall.width;
    const h = wall.height;
    const members = [];

    for (let ty = 0; ty < h; ty += TILE_SIZE) {
      for (let tx = 0; tx < w; tx += TILE_SIZE) {
        const tileW = Math.min(TILE_SIZE, w - tx);
        const tileH = Math.min(TILE_SIZE, h - ty);

        const sprite = Resources.MazeWall.toSprite();

        if (tileW < TILE_SIZE || tileH < TILE_SIZE) {
          sprite.sourceView = {
            x: 0,
            y: 0,
            width: tileW,
            height: tileH,
          };
          sprite.destSize = {
            width: tileW,
            height: tileH,
          };
        }

        // Voeg de sprite toe aan de groep met de juiste offset (positie binnen de hitbox)
        members.push({
          graphic: sprite,
          offset: new Vector(tx, ty),
        });
      }
    }

    // Maak een GraphicsGroup aan van alle sprites
    const group = new GraphicsGroup({
      members: members,
    });

    // Koppel deze groep direct aan de hitbox!
    wall.graphics.use(group);
  }

  killEnemies() {
    this.actors.forEach((element) => {
      if (element instanceof Enemy) {
        element.kill();
      }
    });
  }
}
