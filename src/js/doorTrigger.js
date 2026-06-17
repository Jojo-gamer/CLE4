import { Actor, CollisionType, Color } from "excalibur";

export class DoorTrigger extends Actor {
  constructor(x, y, width, height, destinationScene, spawnX, spawnY) {
    super({
      x,
      y,
      width,
      height,
      color: Color.Transparent
    });

    this.destinationScene = destinationScene;
    this.spawnX = spawnX;
    this.spawnY = spawnY
    this.body.collisionType = CollisionType.Passive;
  }

  onInitialize(engine) {
    this.on("collisionstart", (evt) => {
      console.log(evt.other.owner.name);
      if (evt.other.owner.name === "player") {
        engine.nextSpawn = {
          x: this.spawnX,
          y: this.spawnY
        }
        engine.goToScene(this.destinationScene);
      }
    });
  }
}