import { Actor, Color, TileMap, Vector } from "excalibur";
import { Resources, spriteSheet } from "./resources.js";

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
    constructor() {
        super();

        // for (let rows = 0; rows < 100; rows++) {
        //     for (let col = 0; col < 50; col++) {
        //         this.addChild(new Actor({
        //             anchor: Vector.Zero,
        //             pos: new Vector(32*col, 32*rows),
        //             graphic: spriteSheet.sprites[14]
        //         }))
        //     }
        // }
        const tilemap = new TileMap({
            pos: new Vector(0, 0),
            tileWidth: 32,
            tileHeight: 32,
            columns: 10,
            rows: 10,
        })

        for (let tile of tilemap.tiles) {
            tile.addGraphic(spriteSheet.getSprite(2, 2));
        }

        this.addChild(tilemap)
    }
}