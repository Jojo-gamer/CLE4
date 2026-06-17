import { Actor, Color, TileMap, Vector } from "excalibur";
import { Resources, spriteSheet } from "./resources.js";


export class Background extends Actor {
    constructor() {
        super();

        const tilemap = new TileMap({
            pos: new Vector(0, 0),
            tileWidth: 32,
            tileHeight: 32,
            columns: Math.ceil(3000 / 32),
            rows: Math.ceil(2000 / 32),
        })

        for (let tile of tilemap.tiles) {
            tile.addGraphic(spriteSheet.getSprite(2, 2));
        }

        this.addChild(tilemap)
    }
}