import { Actor, CollisionType, Color } from "excalibur";

export class DoorTrigger extends Actor {
  constructor(x, y, width, height, destinationScene, spawnPoint) {
    super({
      x,
      y,
      width,
      height,
      color: Color.Transparent
    });

    this.destinationScene = destinationScene;
    this.spawnPoint = spawnPoint;
    this.body.collisionType = CollisionType.Passive;
  }

  onInitialize(engine) {
    this.on("collisionstart", (evt) => {
      if (evt.other.name === "player") {
        engine.goToScene(this.destinationScene);
      }
    });
  }
}