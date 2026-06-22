import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer, Scene, randomInRange, CollisionType } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'

export class TableVertical extends Actor {

    constructor(isReal = true) {


        const scale = 0.4;
        const width = Resources.TableVertical.width * scale;
        const height = Resources.TableVertical.height * scale;
        super({
            width: 80,
            height: 130,
        });

        this.isReal = isReal;

        this.tableSprite = Resources.TableVertical.toSprite();
        this.tableSprite.scale = new Vector(scale, scale);
        this.graphics.use(this.tableSprite);
        this.body.collisionType = CollisionType.Fixed
        this.prop = true
        this.z = 1
    }
    onInitialize() {
        this.body.collisionType = CollisionType.Fixed
    }


}