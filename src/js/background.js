import { Actor, Color, SpriteSheet, TileMap, Vector } from "excalibur";
import { Resources } from "./resources.js";

export class background extends TileMap {
    constructor(spriteSheet) {
        super({
            pos: new Vector(0, 0),
            tileWidth: 16,
            tileHeight: 16,
            columns: 100,
            rows: 100,
        })
        
        for (let tile of this.tiles) {
            tile.addGraphic(spriteSheet.getSprite(8, 3));
        }

    }
}