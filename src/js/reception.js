import { BoundingBox, Color, Scene, Vector } from "excalibur";
import { Background } from "./background";
import { Player } from "./player";

export class Reception extends Scene {
    constructor() {
        const sceneWidth = 1280
        const sceneHeight = 1000

        super({
            width: sceneWidth,
            height: sceneHeight,
            color: Color.Black,
        });

        this.sceneWidth = sceneWidth
        this.sceneHeight = sceneHeight

    }

    onInitialize(engine) {
        this.location = "EastWing" //engine.currentSceneName
        this.add(new Background(this.sceneWidth, this.sceneHeight, this.location))

        this.player = new Player();
        const spawnPoint = this.engine.nextSpawn || { x: 400, y: 500 };
        this.player.pos = new Vector(spawnPoint.x, spawnPoint.y)
        this.add(this.player);

        this.camera.strategy.lockToActor(this.player)
        this.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, this.sceneWidth, this.sceneHeight))
    }

}