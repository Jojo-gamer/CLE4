import { Actor, CollisionType, Color, randomIntInRange, Vector } from "excalibur";
import { Resources, ResourceLoader } from "./resources";

export class Dog extends Actor {

    dirUp;
    dirLeft;
    dirRight;
    dirDown;

    constructor(){
        super({
            width: 65,
            height: 120,
        }   
        )

        this.body.collisionType = CollisionType.Active

    }

    onInitialize(engine){
    }

    onPreUpdate(engine){
    }

    roamEvent(){
        
    }

}