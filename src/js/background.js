import { Actor, TileMap, Vector } from "excalibur";
import { Resources, cafWalls, outside } from "./resources.js";


export class Background extends Actor {
    constructor(width, height, location, blockade = null) {
        super();

        const tileWidth = 128
        const tileHeight = 128
        const columns = Math.floor(width / tileWidth)
        const rows = Math.floor(height / tileHeight)
        const mapWidth = columns * tileWidth
        const mapHeight = rows * tileHeight

        let floorTiles;
        let wallTiles = cafWalls
        let rightTopCorner = cafWalls.getSprite(1, 0)
        let rightBottomCorner = cafWalls.getSprite(3, 0)

        switch (location) {
            case "Cafetaria":
                floorTiles = Resources.CafTile.toSprite()
                break;
            case "EastWing":
                floorTiles = Resources.WingTile.toSprite()
                break;
            case "EW_Room1":
                floorTiles = Resources.WingTile.toSprite()
                break;
            case "EW_Room2":
                floorTiles = Resources.WingTile.toSprite()
                break;
            case "CourtYard":
                floorTiles = outside.getSprite(3, 0)
                wallTiles = outside
                rightTopCorner = outside.getSprite(2, 0)
                rightBottomCorner = cafWalls.getSprite(0, 0)
        }

        const tilemap = new TileMap({
            tileWidth, tileHeight, columns, rows,
            pos: new Vector((width - mapWidth) / 2, (height - mapHeight) / 2),
        })

        let index = 0
        for (let tile of tilemap.tiles) {
            const columns = tilemap.columns
            const tileCount = tilemap.tiles.length
            if (index < columns && index !== 0 && index !== columns - 1) {  //upperwal
                tile.addGraphic(floorTiles);  //floor
                tile.addGraphic(wallTiles.getSprite(0, 0));
                tile.solid = true
            } else if (index % columns === 0) {     //left wall
                tile.addGraphic(cafWalls.getSprite(2, 0));
                tilemap.tiles[tileCount - columns].addGraphic(cafWalls.getSprite(4, 0))
                tile.solid = true
            } else if (index % columns === columns - 1) {   //right wall
                if (index === columns - 1) tile.addGraphic(rightTopCorner)
                if (index === tileCount - 1) tile.addGraphic(rightBottomCorner)
                if (index !== columns - 1 && index !== tileCount - 1) tile.addGraphic(wallTiles.getSprite(1, 0));
                tile.solid = true

            } else if (index > tileCount - columns) {    //bottom wall
                tile.addGraphic(cafWalls.getSprite(0, 0));
                tile.solid = true
                tile.z = 500
            } else {
                tile.addGraphic(floorTiles);  //floor
            }
            index++
        }
        this.addChild(tilemap)


    }
}