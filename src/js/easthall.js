import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer, Scene, randomInRange, CollisionType } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Background } from "./background.js"
import { DoorTrigger } from "./doorTrigger.js";
import { Player } from "./player.js";
import { MazeTileCollisionBuilder } from './collisionbuilder.js'
import { Dog } from "./dog.js";




export class Easthall extends Scene {
    constructor() {
        super({
            width: 4320,
            height: 1440,
            queueMicrotaskcolor: Color.Black
        }
        )
    }

    async onInitialize(){
// In your scene's onInitialize:
this.currentPathTile = null;

const WORLD_WIDTH = 4320
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

const dog = new Dog()
dog.z = 999;
this.add(dog)


this.player.on('collisionstart', (e) => {
    const floorTile = e.other.owner
    if(floorTile.name === 'path') {
        this.player.pathContacts++

    }
})


this.player.on('collisionend', (e) => {
    const floorTile = e.other.owner
    if(floorTile.name === 'path') {
        this.player.pathContacts--

        if (this.player.pathContacts === 0) {
            this.player.loseLife()
            this.player.pos = new Vector(852, 710)
            dog.pos = new Vector(840, 710)
        }
    }
})

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
  "/images/East-hall-map.png",
  WORLD_WIDTH,
  WORLD_HEIGHT,
  {
    tileSize: 1,
    tolerance: 20,
    treatBlackAsCollision: false
  }
)

const walls = MazeTileCollisionBuilder.createCollisionActors(rects)
for (const wall of walls) {
     if(wall.pos.x >= 1080 && wall.pos.x <= 3600) {
                 wall.graphics.use(Resources.floorTile.toSprite())        
                 if (Math.random() > 0.75) {
                        wall.actions.fade(0.3, 100);
        }
     }
     wall.isReal = false
  this.add(wall)
}
    }


    


}


