import { Actor, BoundingBox, CollisionType, Color, CompositeCollider, EdgeCollider, Scene, Shape, vec, Vector } from "excalibur";
import { Background } from "./background";
import { Player } from "./player";
import { Resources } from "./resources";
import { MazeTileCollisionBuilder } from "./collisionbuilder";
import { DoorTrigger } from "./doorTrigger";
import { Dog } from "./dog";
import { Rubble } from "./rubble";

export class Reception extends Scene {
    door;

    constructor() {
        const sceneWidth = 1280
        const sceneHeight = 1000

        super({
            width: sceneWidth,
            height: sceneHeight,
            color: Color.Black,
        });

        this.sceneWidth = sceneWidth
        this.sceneHeight = sceneHeight

    }

    onInitialize(engine) {
        const bg = new Actor({
            x: 0,
            y: 0,
            width: this.sceneWidth,   // Explicitly give the actor the world width (4000)
            height: this.sceneHeight, // Explicitly give the actor the world height (2000)
            anchor: Vector.Zero   // Keep the top-left alignment
        })
        const bgImg = Resources.Reception.toSprite();
        bgImg.scale = new Vector((this.sceneWidth / bgImg.width), (this.sceneHeight / bgImg.height))
        bg.graphics.use(bgImg)
        this.add(bg)
        this.addCollisions()

        this.player = new Player();
        this.add(this.player);

        this.dog = new Dog(false)
        this.dog.pos = new Vector(760, 430)
        this.add(this.dog)

        this.camera.strategy.lockToActor(this.player)
        this.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, this.sceneWidth, this.sceneHeight))
    }

    onActivate(ctx) {
        const spawn = ctx.data?.spawn ?? { x: 400, y: 500 };
        this.player.pos = new Vector(spawn.x, spawn.y);
    }

    addCollisions(engine) {
        const tileWidth = 80
        const tileHeight = 62.5
        this.rubble = new Rubble(tileWidth, tileHeight)
        this.add(this.rubble)
        this.add(new Actor({ pos: vec(7 * tileWidth, 0), anchor: vec(0, 0), collisionType: CollisionType.Fixed, collider: new EdgeCollider({ begin: vec(0, 0), end: vec(4 * tileWidth, 0) }) }))
        this.add(new Actor({ width: 6 * tileWidth, height: tileHeight, anchor: vec(0, 0), color: Color.Black }))
        this.add(new Actor({ x: 10 * tileWidth, width: 6 * tileWidth, height: 1 * tileHeight, anchor: vec(0, 0), color: Color.Black }))
        this.add(new Actor({ pos: vec(0, 13 * tileHeight), width: 5 * tileWidth, height: 3 * tileHeight + 2, anchor: vec(0, 0), color: Color.Black }))
        this.add(new Actor({ pos: vec(11 * tileWidth, 13 * tileHeight), width: 5 * tileWidth, height: 3 * tileHeight + 2, anchor: new Vector(0, 0), color: Color.Black }))
        this.add(new Actor({
            pos: vec(5 * tileWidth, 6 * tileHeight), anchor: vec(0, 0), collisionType: CollisionType.Fixed, collider: new CompositeCollider([
                Shape.Box(tileWidth, 3 * tileHeight, vec(0, 0)),
                Shape.Box(4 * tileWidth, tileHeight, vec(0, 0), vec(tileWidth, 2 * tileHeight)),
                Shape.Box(tileWidth, 3 * tileHeight, vec(0, 0), vec(5 * tileWidth, 0))
            ])
        }))
        this.add(new Actor({
            collisionType: CollisionType.Fixed, collider: new CompositeCollider([
                Shape.Box(tileWidth, 2 * tileHeight, vec(0, 0), vec(6 * tileWidth, 0)),
                Shape.Box(6 * tileWidth, tileHeight, vec(0, 0), vec(0, tileHeight)),
                Shape.Box(tileWidth, 7 * tileHeight, vec(0, 0), vec(0, 2 * tileHeight)),
                Shape.Box(2 * tileWidth, 4 * tileHeight, vec(0, 0), vec(0, 9 * tileHeight)),
                Shape.Box(4 * tileWidth, 2 * tileHeight, vec(0, 0), vec(2 * tileWidth, 11 * tileHeight)),
                Shape.Box(tileWidth, 3 * tileHeight, vec(0, 0), vec(5 * tileWidth, 13 * tileHeight))
            ])
        }))
        this.add(new Actor({
            collisionType: CollisionType.Fixed, collider: new CompositeCollider([
                Shape.Box(tileWidth, 2 * tileHeight, vec(0, 0), vec(9 * tileWidth, 0)),
                Shape.Box(6 * tileWidth, tileHeight, vec(0, 0), vec(10 * tileWidth, tileHeight)),
                Shape.Box(tileWidth, 7 * tileHeight, vec(0, 0), vec(15 * tileWidth, 2 * tileHeight)),
                Shape.Box(2 * tileWidth, 4 * tileHeight, vec(0, 0), vec(14 * tileWidth, 9 * tileHeight)),
                Shape.Box(4 * tileWidth, 2 * tileHeight, vec(0, 0), vec(10 * tileWidth, 11 * tileHeight)),
                Shape.Box(tileWidth, 3 * tileHeight, vec(0, 0), vec(10 * tileWidth, 13 * tileHeight))
            ])
        }))
        this.door = new DoorTrigger(8 * tileWidth, tileHeight, 2 * tileWidth, tileHeight, "Cafetaria", 1500, 1700, 'up', false)
        this.add(this.door)
    }
}