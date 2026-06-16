import { Actor, Color, SpriteSheet, TileMap, Vector } from "excalibur";
import { Resources } from "./resources.js";

export class background extends TileMap {
    constructor() {
        super({
            pos: new Vector(0, 0),
            tileWidth: 16,
            tileHeight: 16,
            columns: 10,
            rows: 10,
        })
    }

    onInitialize(engine) {
        const spriteSheet = SpriteSheet.fromImageSource({
            image: Resources.Tiles,
            grid: {
                tileWidth: 16,
                tileHeight: 16,
                columns: 10,
                rows: 10,
            }
        })

        for (let i = 0; i < this.tiles.length; i++) {
            const tile = this.tiles[i];
            tile.addGraphic(spriteSheet.getSprite(3, 3));
        }

    }
}