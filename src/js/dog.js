import {
  Actor,
  CollisionType,
  Color,
  Keys,
  Buttons,
  Ray,
  Sound,
  SpriteSheet,
  TileMap,
  Vector,
  range,
  Animation,
  Line,
} from "excalibur";
import { Resources } from "./resources";
import { Enemy } from "./enemy";
import { Keyfragment } from "./keyfragment";
import { Crowbar } from "./crowbar";

export class Dog extends Actor {
  constructor(follow = true) {
    super({
      width: 40,
      height: 50,
      pos: new Vector(0, 0),
      scale: new Vector(0.6, 0.6),
      z: 1,
    });
    this.fakedWall = false;
    this.wallCutscene = false;
    this.isRayCastable = false;
    this.isReal = true;
    this.follow = follow;
    this.rayDebug = null;
    this.petted = false;
    this.petCounter = 0;
  }

  onInitialize(engine) {
    if (this.follow) this.actions.follow(this.scene.player, 75);
    this.body.collisionType = CollisionType.Passive;
    this.graphics.use(Resources.DogFront.toSprite());
    this.player = this.scene.player;
    this.dir = Vector.Right;

    //initialize controller
    this.gamepad = engine.gamepad ?? engine.input.gamepads.at(0);

    //Importing sprite sheets
    const dogUp = SpriteSheet.fromImageSource({
      image: Resources.DogFront,
      grid: { rows: 1, columns: 4, spriteWidth: 128, spriteHeight: 128 },
    });

    const dogSide = SpriteSheet.fromImageSource({
      image: Resources.DogSide,
      grid: { rows: 1, columns: 4, spriteWidth: 128, spriteHeight: 128 },
    });

    const dogDown = SpriteSheet.fromImageSource({
      image: Resources.DogBack,
      grid: { rows: 1, columns: 4, spriteWidth: 128, spriteHeight: 128 },
    });

    const dogPet = SpriteSheet.fromImageSource({
      image: Resources.DogPet,
      grid: { rows: 1, columns: 2, spriteWidth: 128, spriteHeight: 128 },
    });

    const movingUp = Animation.fromSpriteSheet(dogUp, range(0, 3), 75);
    const movingSide = Animation.fromSpriteSheet(dogSide, range(0, 3), 75);
    const movingDown = Animation.fromSpriteSheet(dogDown, range(0, 3), 75);
    const goodBoy = Animation.fromSpriteSheet(dogPet, range(0, 1), 60);

    const idleUp = dogUp.getSprite(0, 0);
    const idleSide = dogSide.getSprite(0, 0);
    const idleDown = dogDown.getSprite(0, 0);

    this.graphics.add("movingUp", movingUp);
    this.graphics.add("movingSide", movingSide);
    this.graphics.add("movingDown", movingDown);
    this.graphics.add("goodBoy", goodBoy);

    this.graphics.add("idleUp", idleUp);
    this.graphics.add("idleSide", idleSide);
    this.graphics.add("idleDown", idleDown);

    this.goodBoy = this.graphics.use(goodBoy);

    this.movingUp = this.graphics.use(movingUp);
    this.movingSide = this.graphics.use(movingSide);
    this.movingDown = this.graphics.use(movingDown);

    this.idleUp = this.graphics.use(idleUp);
    this.idleSide = this.graphics.use(idleSide);
    this.idleDown = this.graphics.use(idleDown);
  }

  onPreUpdate(engine) {
    if (!this.follow) return;
    if (this.player.dirUp) {
      this.dir = Vector.Up;
      if (this.vel.y < 0) {
        this.graphics.use(this.movingDown);
        this.z = 2;
      } else {
        this.graphics.use(this.idleDown);
      }
    }

    if (this.player.dirDown) {
      this.dir = Vector.Down;
      if (this.vel.y > 0) {
        this.graphics.use(this.movingUp);
        this.z = 1;
      } else {
        this.graphics.use(this.idleUp);
      }
    }

    if (this.player.dirLeft) {
      this.dir = Vector.Left;
      if (this.vel.x < 0) {
        this.graphics.use(this.movingSide);
      } else {
        this.graphics.use(this.idleSide);
      }
      this.graphics.flipHorizontal = true;
    }

    if (this.player.dirRight) {
      this.dir = Vector.Right;
      if (this.vel.x > 0) {
        this.graphics.use(this.movingSide);
      } else {
        this.graphics.use(this.idleSide);
      }
      this.graphics.flipHorizontal = false;
    }

    //pet that dawg
    this.playerDistance = this.player.pos.distance(this.pos);

    if (
      this.playerDistance < 60 &&
      (engine.input.keyboard.wasPressed(Keys.E) ||
        this.gamepad.isButtonPressed(Buttons.Face1))
    ) {
      this.beingPet = true;
      this.petCounter = 0;
    }

    if (this.beingPet) {
      this.petCounter++;
      this.graphics.use(this.goodBoy);
      if (this.petCounter >= 50) {
        this.beingPet = false;
      }
    }

    //CUTSCENE TIME
    if (
      engine.currentSceneName == "EastWing" &&
      !this.fakedWall &&
      this.player.pos.x < 890
    ) {
      this.actions.clearActions();
      this.vel = new Vector(0, -367);
      this.graphics.use(this.movingDown);
    }

    if (this.pos.y < -180) {
      this.fakedWall = true;
      this.vel = new Vector(0, 367);
    }

    if (this.vel.y > 0 && this.fakedWall && !this.wallCutscene) {
      // console.log("bruh");
      this.graphics.use(this.movingUp);
    }

    if (this.pos.y > 350 && this.fakedWall) {
      this.wallCutscene = true;
    }

    if (this.wallCutscene) {
      this.actions.follow(this.scene.player, 75);
    }
    if (this.wallCutscene) {
      this.actions.follow(this.scene.player, 75);
    }

    if (engine.input.keyboard.wasPressed(Keys.Space) || this.gamepad.isButtonPressed(Buttons.Face4)) {
      const bounds = this.player.collider.bounds;
      const rayDirection = this.dir.normalize();
      const rayOrigin = this.player.pos.add(
        new Vector(0, this.player.offset.y),
      );

      const maxDistance = 150;

      const ray = new Ray(rayOrigin, rayDirection);
      const hits = this.scene.physics.rayCast(ray, {
        searchAllColliders: true, // Stop direct bij het eerste doelwit
        maxDistance,
        filter: (hit) => {
          const owner = hit.collider.owner;
          return owner.isRayCastable === true;
        },
      });

      const targetHit = hits.find((hit) => hit.distance >= 0);

      if (targetHit) {
        const owner = targetHit.collider.owner;
        // console.log(owner);
        // console.log(
        //   "Owner found:",
        //   owner.name,
        //   "isReal:",
        //   owner.isReal,
        //   "isTileMap:",
        //   owner instanceof TileMap,
        // );
        if (!owner.isReal && !(owner instanceof TileMap)) {
          owner.body.collisionType = CollisionType.Passive;
          owner.actions.clearActions();
          owner.actions.fade(0.3, 200);
          owner.isRayCastable = false;

          if (engine.currentSceneName === "EastHall") {
            Resources.BarkSound.play();
          }

          if (owner.hasKeyFragment) {
            this.scene.add(new Keyfragment(owner.pos, owner.keyfragmentPart));
          }
        } else {
          if (owner instanceof Crowbar && owner.isReal) {
            owner.actions.fade(1, 1000);
          }
          // console.log('WOOF')
          Resources.BarkSound.play();
          //chance to spawn new enemy
          if (Math.random() > 0.6) {
            // console.log('spawn')

            const isReal = Math.random() > 0.5;
            const enemy = new Enemy(isReal);
            this.scene.add(enemy);
          }
        }
      }
    }
  }
}
