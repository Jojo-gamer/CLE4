import { Actor, Vector, BoundingBox, Color, Scene, CollisionType } from "excalibur"
import { Resources } from './resources.js'
import { DoorTrigger } from "./doorTrigger.js"
import { Player } from "./player.js"
import { MazeTileCollisionBuilder } from './mazecollisionbuilder.js'

const TILE_SIZE = 128 // grootte van wall-tiles-128x128.png

export class EastHallWay extends Scene {
    constructor() {
        super({
            width: 1440,
            height: 5760,
            color: Color.Black
        })
    }

    async onInitialize() {
        const WORLD_WIDTH  = 1440
        const WORLD_HEIGHT = 5760
        const MAP_WIDTH    = 256
        const MAP_HEIGHT   = 1024
        const MAP_SCALE    = WORLD_WIDTH / MAP_WIDTH  // 5.625

        this.player = new Player()
        this.player.z = 999

        this.add(new DoorTrigger(1416, 350, 50, 150, "EastHall", 100, 150));

        const spawnPoint = this.engine.nextSpawn || { x: 400, y: 400 }
        this.player.pos = new Vector(spawnPoint.x, spawnPoint.y)
        this.add(this.player)
        this.camera.strategy.lockToActor(this.player)
        this.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, WORLD_WIDTH, WORLD_HEIGHT))

        // Border walls
        const borderWalls = [
            new Actor({ x: 0,           y: -10,          width: WORLD_WIDTH,  height: 10,          anchor: Vector.Zero, collisionType: CollisionType.Fixed }),
            new Actor({ x: 0,           y: WORLD_HEIGHT,  width: WORLD_WIDTH,  height: 10,          anchor: Vector.Zero, collisionType: CollisionType.Fixed }),
            new Actor({ x: -10,         y: 0,            width: 10,           height: WORLD_HEIGHT, anchor: Vector.Zero, collisionType: CollisionType.Fixed }),
            new Actor({ x: WORLD_WIDTH, y: 0,            width: 10,           height: WORLD_HEIGHT, anchor: Vector.Zero, collisionType: CollisionType.Fixed })
        ]
        for (const wall of borderWalls) this.add(wall)

        // Achtergrond
        const bg = new Actor({ x: 0, y: 0, width: WORLD_WIDTH, height: WORLD_HEIGHT, anchor: Vector.Zero })
        const bgImg = Resources.EastHallWay.toSprite()
        bgImg.scale = new Vector(WORLD_WIDTH / bgImg.width, WORLD_HEIGHT / bgImg.height)
        bg.graphics.use(bgImg)
        this.add(bg)

        // Collision rects op native resolutie
        const rects = await MazeTileCollisionBuilder.fromImage(
            "/images/East-maze.png",
            MAP_WIDTH,
            MAP_HEIGHT,
            {
                tileSize: 4,
                scale: MAP_SCALE,
                treatGreenAsCollision: true,
                greenIsSolid: true,
                treatBlackAsCollision: true,
                blackIsSolid: false
            }
        )

        const walls = MazeTileCollisionBuilder.createCollisionActors(rects)

        for (const wall of walls) {
            wall.z = 10
            this.add(wall)

            // Spawn herhalende sprite-tegels over de volledige hitbox
            this.addTiledSprite(wall.pos.x, wall.pos.y, wall.width, wall.height)

            // Echte muur: hitbox zichtbaar houden (sprites doen het visuele werk)
            // maar de actor zelf onzichtbaar
            wall.graphics.opacity = 0
        }
    }

    /**
     * Vult een rechthoek op (x, y, w, h) met herhalende 128x128 muurtegels.
     * Elke tegel is een aparte Actor zonder collision — puur visueel.
     */
    addTiledSprite(x, y, w, h) {
        for (let ty = 0; ty < h; ty += TILE_SIZE) {
            for (let tx = 0; tx < w; tx += TILE_SIZE) {
                const tileW = Math.min(TILE_SIZE, w - tx)
                const tileH = Math.min(TILE_SIZE, h - ty)

                const tileActor = new Actor({
                    x: x + tx,
                    y: y + ty,
                    width:  tileW,
                    height: tileH,
                    anchor: Vector.Zero,
                    collisionType: CollisionType.PreventCollision
                })

                const sprite = Resources.MazeWall.toSprite()

                // Als de tegel aan de rand kleiner is dan 128px: crop de sprite
                if (tileW < TILE_SIZE || tileH < TILE_SIZE) {
                    sprite.sourceView = {
                        x: 0,
                        y: 0,
                        width:  tileW,
                        height: tileH
                    }
                    sprite.destSize = {
                        width:  tileW,
                        height: tileH
                    }
                }

                tileActor.graphics.use(sprite)
                tileActor.z = 10
                this.add(tileActor)
            }
        }
    }
}