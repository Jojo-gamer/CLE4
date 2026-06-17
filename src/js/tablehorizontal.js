import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer, Scene, randomInRange, CollisionType } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'

export class TableHorizontal extends Actor {

    constructor(isReal = true) {

        const scale = 0.4;
        const width = Resources.TableHorizontal.width * scale;
        const height = Resources.TableHorizontal.height * scale;
        super({
            width: 130,
            height: 80,
        });

        this.isReal = isReal;

        this.tableSprite = Resources.TableHorizontal.toSprite();
        this.tableSprite.scale = new Vector(scale, scale);
        this.graphics.use(this.tableSprite);
        // this.body.collisionType = CollisionType.Fixed
        this.prop = true
    }
    onInitialize() {
        this.body.collisionType = CollisionType.Fixed
    }







}