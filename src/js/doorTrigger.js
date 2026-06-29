import { Actor, CollisionType, Color, Vector } from "excalibur";
import { doors } from "./resources";

export class DoorTrigger extends Actor {
  constructor(
    x,
    y,
    width,
    height,
    destinationScene,
    spawnX,
    spawnY,
    location,
    active = true,
  ) {
    super({
      x,
      y,
      width,
      height,
      color: Color.Transparent,
    });

    this.destinationScene = destinationScene;
    this.spawn = { x: spawnX, y: spawnY }
    this.body.collisionType = CollisionType.Passive;
    this.location = location;
    this.triggerEnabled = active;
  }

  onInitialize(engine) {
    switch (this.location) {
      case "left":
        this.graphics.use(doors.getSprite(2, 0));
        this.graphics.offset = new Vector(90, 0);
        break;
      case "up":
        this.graphics.use(doors.getSprite(0, 0));
        this.graphics.offset = new Vector(0, -30);
        break;
      case "down":
        this.graphics.use(doors.getSprite(6, 0));
        this.graphics.offset = new Vector(0, -90);
        break;
      case "right":
        this.graphics.use(doors.getSprite(4, 0));
        this.graphics.offset = new Vector(-90, 0);
        break;
      case "empty":
        break;
      default:
    }

    this.on("collisionstart", (evt) => {
      if (!this.triggerEnabled) return;
      if (evt.other.owner.name === "player") {
        engine.goToScene(this.destinationScene, {
          sceneActivationData: {
            spawn: this.spawn,
          },
        });
        //   if (this.destinationScene === "Endscene") {
        //     engine.goToScene(this.destinationScene, {
        //       sceneActivationData: {
        //         timeScore: engine.timer
        //       },
        //     });
        //   } else {
        //     engine.goToScene(this.destinationScene, {
        //       sceneActivationData: {
        //         spawn: this.spawn,
        //       },
        //     });
        //   }
      }
    });
  }

  onPostUpdate(engine) {
    if (this.triggerEnabled) {
      switch (this.location) {
        case "left":
          this.graphics.use(doors.getSprite(3, 0));
          break;
        case "up":
          this.graphics.use(doors.getSprite(1, 0));
          break;
        case "right":
          this.graphics.use(doors.getSprite(5, 0));
          break;
        case "down":
          this.graphics.use(doors.getSprite(7, 0));
          this.graphics.offset = new Vector(0, -87);
          break;
        default:
      }
    }
  }
}
