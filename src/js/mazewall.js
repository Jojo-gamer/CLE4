import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer, Scene, randomInRange, CollisionType } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'

export class mazewall extends Actor {
    constructor() {
        super();
    }

    constructor(isReal = true) {
    
    
            const scale = 0.4;
            const width = Resources.MazeWall.width * scale;
            const height = Resources.MazeWall.height * scale;
            super({
                width: 80,
                height: 130,
            });
    
            this.isReal = isReal;
    
            this.tableSprite = Resources.MazeWall.toSprite();
            this.tableSprite.scale = new Vector(scale, scale);
            this.graphics.use(this.tableSprite);
            this.body.collisionType = CollisionType.Fixed
            
            this.z = 1
        }
        onInitialize() {
            if (!this.isReal) {
            this.body.collisionType = CollisionType.Passive
        } else {
            this.body.collisionType = CollisionType.Fixed
        }
    }
}