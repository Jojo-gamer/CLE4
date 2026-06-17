import { Actor, Color, TileMap, Vector } from "excalibur";
import { Resources, spriteSheet } from "./resources.js";


export class Background extends Actor {
    constructor() {
        super();

        const tilemap = new TileMap({
            pos: new Vector(0, 0),
            tileWidth: 128,
            tileHeight: 128,
            columns: Math.ceil(3000 / 128),
            rows: Math.ceil(2000 / 128),
        })

        for (let tile of tilemap.tiles) {
            // tile.addGraphic(spriteSheet.getSprite(2, 2));
            tile.addGraphic(Resources.CafTile.toSprite());
        }

        this.addChild(tilemap)
    }
}