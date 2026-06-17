import { Actor, CollisionType, Vector } from "excalibur";
import { Resources } from "./resources";

export class Table extends Actor {
    isReal;
    
    constructor(pos, isReal) {
        super({
            width: 250,
            height: 10,
            z: 1,
            anchor: new Vector(0.5, 0.4),
            pos: pos,
            scale: new Vector(0.3, 0.3)
        })

        this.isReal = isReal
        this.graphics.use(Resources.Table.toSprite())
    }

    onInitialize(engine) {
        if(this.isReal) {
            this.body.collisionType = CollisionType.Fixed
        } else {
            this.body.collisionType = CollisionType.Passive
        }
    }
}