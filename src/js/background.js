import { Actor, Color, TileMap, Vector } from "excalibur";
import { Resources, cafWalls } from "./resources.js";


export class Background extends Actor {
    constructor() {
        super();

        const tilemap = new TileMap({
            pos: new Vector(0, 0),
            tileWidth: 128,
            tileHeight: 128,
            columns: Math.floor(3000 / 128),
            rows: Math.floor(2000 / 128),
        })

        let index = 0
        for (let tile of tilemap.tiles) {
            // tile.addGraphic(spriteSheet.getSprite(2, 2));
            const columns = tilemap.columns
            const tileCount = tilemap.tiles.length
            if (index < columns && index !== 0 && index !== columns - 1) {  //upperwal
                tile.addGraphic(cafWalls.getSprite(0, 0));
                tile.solid = true
                // console.log(tile)
            } else if (index % columns === 0) {     //left wall
                tile.addGraphic(cafWalls.getSprite(2, 0));
                tilemap.tiles[tileCount - columns].addGraphic(cafWalls.getSprite(4, 0))
                tile.solid = true
            } else if (index % columns === columns - 1) {   //right wall
                tile.addGraphic(cafWalls.getSprite(1, 0));
                tilemap.tiles[tileCount-1].addGraphic(cafWalls.getSprite(3, 0))
                tile.solid = true
            } else if (index > tileCount - columns) {    //bottom wall
                tile.addGraphic(cafWalls.getSprite(0, 0));
                tile.solid = true
            } else {
                tile.addGraphic(Resources.CafTile.toSprite());  //floor
            }
            index++
        }

        this.addChild(tilemap)
    }
}