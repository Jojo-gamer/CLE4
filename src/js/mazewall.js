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

export class mazewall extends Actor {
  constructor(isReal = true) {
    const scale = 0.4;
    const width = Resources.MazeWall.width * scale;
    const height = Resources.MazeWall.height * scale;
    super({
      width: 80,
      height: 130,
    });

    this.isReal = isReal;
    this.isRayCastable = true;
    this.MazeHSprite = Resources.MazeWall.toSprite();
    this.MazeHSprite.scale = new Vector(scale, scale);
    this.MazeVSprite = Resources.WallVertical.toSprite();
    this.MazeVSprite.scale = new Vector(scale, scale);
    this.graphics.use(this.MazeHSprite);
    this.body.collisionType = CollisionType.Fixed;

    this.z = 1;
  }
  onInitialize() {
    if (!this.isReal) {
      this.body.collisionType = CollisionType.Passive;
    } else {
      this.body.collisionType = CollisionType.Fixed;
    }
  }

  checkOrientation() {
    const allOtherWalls = this.scene.actors.filter(
      (actor) => actor instanceof mazewall && actor !== this,
    );

    let wallAbove = false;
    let wallBelow = false;

    const checkDistance = this.height + 10;

    for (const wall of allOtherWalls) {
      if (Math.abs(wall.pos.x - this.pos.x) < 5) {
        if (
          wall.pos.y < this.pos.y &&
          Math.abs(this.pos.y - wall.pos.y) <= checkDistance
        ) {
          wallAbove = true;
        }

        if (
          wall.pos.y > this.pos.y &&
          Math.abs(wall.pos.y - this.pos.y) <= checkDistance
        ) {
          wallBelow = true;
        }
      }
    }

    if (wallAbove && wallBelow) {
      this.graphics.use(this.MazeVSprite);

      console.log(
        "Verticale muur gedetecteerd op positie:",
        this.pos.x,
        this.pos.y,
      );
    }
  }
}
