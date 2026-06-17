import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer, Scene, randomInRange } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { background } from "./background.js"
import { DoorTrigger } from "./doorTrigger.js";
import { Player } from "./player.js";
import { CollisionMapGenerator } from './CollisionMapGenerator.js'




export class Easthall extends Scene {
    constructor() {
        super()
    }

    onInitialize(){
// In your scene's onInitialize:
const collisions = await CollisionMapGenerator.generateCollisionsFromImage('./images/East-hall-map.png')

collisions.forEach(bbox => {
  const wall = new Actor({
    x: bbox.x,
    y: bbox.y,
    width: bbox.width,
    height: bbox.height,
    collisionType: CollisionType.Fixed
  })
  this.add(wall)
})
    }
}