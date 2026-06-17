import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer, Scene, randomInRange, CollisionType } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'

export class TableHorizontal extends Actor {
    constructor() {
        const scale = 0.4;
        const width = Resources.TableHorizontal.width * scale;
        const height = Resources.TableHorizontal.height * scale;
        super({ width, height });

        this.tableSprite = Resources.TableHorizontal.toSprite();
        this.tableSprite.scale = new Vector(scale, scale);
        this.graphics.use(this.tableSprite);
        this.body.collisionType = CollisionType.Fixed
    }


}