import { Actor, Color } from "excalibur";

export class Keyfragment extends Actor {
    constructor(position) {
        super({
            width: 20, 
            height: 20, 
            color: Color.Brown, 
            pos: position
        })
    }
}