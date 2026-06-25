import {
    Actor,
    Engine,
    Vector,
    DisplayMode,
    BoundingBox,
    Color,
    SolverStrategy,
    Timer,
    Scene,
    randomInRange,
} from "excalibur";
import { Resources, ResourceLoader } from "./resources.js";
import { Background } from "./background.js";
import { DoorTrigger } from "./doorTrigger.js";
import { Player } from "./player.js";
import { TableVertical } from "./tablevertical.js";
import { TableHorizontal } from "./tablehorizontal.js";
import { Dog } from "./dog.js";
import { Enemy } from "./enemy.js";



export class Cafetaria extends Scene {
    isReal;
    currentScene;
    placedProps = [];
    canMove = true;
    
    constructor() {
      super();
        this.sceneWidth = 3000;
        this.sceneHeight = 2000;
        
    }
    onInitialize() {

      this.add(new Background(this.sceneWidth, this.sceneHeight, "Cafetaria"));
        this.player = new Player();
        this.add(this.player);

        this.dog = new Dog();
        this.dog.pos = this.player.pos;
        this.add(this.dog);

        this.camera.strategy.lockToActor(this.player);
        this.camera.strategy.limitCameraBounds(
            new BoundingBox(0, 0, this.sceneWidth, this.sceneHeight),
        );

        this.eastWingDoor = new DoorTrigger(130, 1000, 50, 150, "EastWing", 2200, 310, "left", false)
        this.courtyardDoor = new DoorTrigger(1500, 140, 150, 50, "CourtYard", 1500, 1750, "up", false)

        this.add(this.eastWingDoor);
        this.add(this.courtyardDoor);
        this.add(
            new DoorTrigger(1500, 1855, 150, 50, "Reception", 650, 100, "down")
        );
    }

    onActivate(ctx) {
        // Player/Dog setup
        if (!this.player) {
            this.player = new Player();
            this.add(this.player);
            this.dog = new Dog(false);
            this.add(this.dog);
        }

        const spawn = ctx.data?.spawn ?? { x: 400, y: 500 };
        this.player.pos = new Vector(spawn.x, spawn.y);
        this.dog.pos = new Vector(spawn.x, spawn.y);
        this.dog.z = 50;

        // Opschonen
        this.killEnemies();
        this.clearProps();

        // Setup props
        this.placePropRandomly(new TableHorizontal(false, true, 0));
        this.placePropRandomly(new TableHorizontal(false, true, 1));
        for (let i = 0; i < 15; i++) this.placePropRandomly(new TableVertical(Math.random() > 0.25));
        for (let i = 0; i < 15; i++) this.placePropRandomly(new TableHorizontal(Math.random() > 0.25));

        // Spawn vijanden
        for (let i = 0; i < 5; i++) this.add(new Enemy(Math.random() > 0.25));

        // Camera & Deuren
        this.camera.strategy.lockToActor(this.player);
        this.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, this.sceneWidth, this.sceneHeight));
    }

    onDeactivate(ctx) {
        this.killEnemies();
    }


    // ... rest van je helper functies (clearProps, killEnemies, placePropRandomly, etc.) blijven hetzelfde


    onPreUpdate(engine, delta) {
        this.playerOutOfBounds();
        this.playerInBounds();
    }

    clearProps() {
        this.placedProps.forEach((prop) => prop.kill());
        this.placedProps = [];
    }

    killEnemies() {
        this.actors.forEach((element) => {
            if (element instanceof Enemy) {
                element.kill();
            }
        });
    }

    placePropRandomly(propInstance) {
        const maxAttempts = 50;
        const padding = 10;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const randomX = randomInRange(300, 2600);
            const randomY = randomInRange(300, 1600);

            const halfW = propInstance.width / 2 + padding;
            const halfH = propInstance.height / 2 + padding;

            const proposedBox = new BoundingBox({
                left: randomX - halfW,
                top: randomY - halfH,
                right: randomX + halfW,
                bottom: randomY + halfH,
            });

            let isOverlapping = false;
            for (const placed of this.placedProps) {
                const pW = placed.width / 2 + padding;
                const pH = placed.height / 2 + padding;
                const placedBox = new BoundingBox({
                    left: placed.pos.x - pW,
                    top: placed.pos.y - pH,
                    right: placed.pos.x + pW,
                    bottom: placed.pos.y + pH,
                });

                if (proposedBox.intersect(placedBox)) {
                    isOverlapping = true;
                    break;
                }
            }

            if (!isOverlapping) {
                propInstance.pos = new Vector(randomX, randomY);
                this.placedProps.push(propInstance);
                this.add(propInstance);
                return;
            }
        }
    }

    playerOutOfBounds() {
        if (this.player.pos.x < 100 || this.player.pos.x > 2940 || this.player.pos.y < 100 || this.player.pos.y > 1900) {
            if (!Resources.OutOfBoundsSound.isPlaying()) Resources.OutOfBoundsSound.play();
        }
    }

    playerInBounds() {
        if (this.player.pos.x > 180 && this.player.pos.x < 2814 && this.player.pos.y > 218 && this.player.pos.y < 1782) {
            if (Resources.OutOfBoundsSound.isPlaying()) Resources.OutOfBoundsSound.stop();
        }
    }
}