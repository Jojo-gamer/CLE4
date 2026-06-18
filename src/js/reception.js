import { Color, Scene } from "excalibur";
import { Background } from "./background";

export class Reception extends Scene {
    constructor() {
        const sceneWidth = 1000
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
        this.add(new Background(this.sceneWidth, this.sceneHeight))
    }

}