import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer, Scene, randomInRange, CollisionType } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Background } from "./background.js"
import { DoorTrigger } from "./doorTrigger.js";
import { Player } from "./player.js";
import { MazeTileCollisionBuilder } from './collisionbuilder.js'




export class Easthall extends Scene {
    constructor() {
        super({
            width: 4480,
            height: 1440,
            queueMicrotaskcolor: Color.Black
        }
        )
    }

    async onInitialize(){
// In your scene's onInitialize:

const WORLD_WIDTH = 4480
const WORLD_HEIGHT = 1440

this.player = new Player();
this.player.z = 999;

const spawnPoint = this.engine.nextSpawn

console.log(spawnPoint.x)
console.log(spawnPoint.y)

this.player.pos = new Vector(spawnPoint.x,spawnPoint.y)
this.add(this.player);
this.camera.strategy.lockToActor(this.player)
this.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, WORLD_WIDTH, WORLD_HEIGHT))

// const collisions = await CollisionMapGenerator.generateCollisionsFromImage(
//   '/images/East-hall.map.png',
//   WORLD_WIDTH,
//   WORLD_HEIGHT
// )

const bg = new Actor({
    x: 0,
    y: 0,
    width: WORLD_WIDTH,   // Explicitly give the actor the world width (4000)
    height: WORLD_HEIGHT, // Explicitly give the actor the world height (2000)
    anchor: Vector.Zero   // Keep the top-left alignment
})
const bgImg = Resources.EastHallMap.toSprite();
bgImg.scale = new Vector((WORLD_WIDTH/bgImg.width),(WORLD_HEIGHT/bgImg.height))

bg.graphics.use(bgImg)
this.add(bg)



const rects = await MazeTileCollisionBuilder.fromImage(
  "/images/East-hall.map.png",
  WORLD_WIDTH,
  WORLD_HEIGHT,
  {
    tileSize: 16,
    tolerance: 15,
    treatBlackAsCollision: false
  }
)

const walls = MazeTileCollisionBuilder.createCollisionActors(rects)
for (const wall of walls) {
  this.add(wall)
}



    }
}


