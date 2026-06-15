import { Actor, Vector } from "excalibur";
import { Resources } from "./resources.js";

export class Tile extends Actor {
  constructor(x, y, color) {
    super({
      pos: new Vector(x, y),
      width: 64,    // tile width
      height: 64,   // tile height
      color: color,
      anchor: Vector.Zero,
    });
  }
}