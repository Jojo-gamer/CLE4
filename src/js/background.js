import { Actor, Color, SpriteSheet, TileMap, Vector } from "excalibur";
import { Resources } from "./resources.js";

// export class background extends TileMap {
//     constructor(spriteSheet) {
//         super({
//             pos: new Vector(0, 0),
//             tileWidth: 16,
//             tileHeight: 16,
//             columns: 100,
//             rows: 100,
//         })



//         for (let tile of this.tiles) {
//             tile.addGraphic(spriteSheet.getSprite(8, 3));
//         }

//     }
// }

export class Background extends Actor {
    constructor(spritesheet) {
        super();

        for (let rows = 0; rows < 100; rows++) {
            for (let col = 0; col < 50; col++) {
                this.addChild(new Actor({
                    anchor: Vector.Zero,
                    pos: new Vector(32*col, 32*rows),
                    graphic: spritesheet.sprites[14]
                }))
            }
        }

    }
}