import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer, Scene, randomInRange } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Background } from "./background.js"
import { DoorTrigger } from "./doorTrigger.js";
import { Player } from "./player.js";
import { TableVertical } from "./tablevertical.js";
import { TableHorizontal } from "./tablehorizontal.js";
import { Dog } from './dog.js'
import { Enemy } from "./enemy.js";


export class Cafetaria extends Scene {
    isReal;
    constructor() {
        super({
            width: 800,
            height: 1000,
            color: Color.Black
        });
        this.placedProps = [];

    }
    onInitialize() {

        this.add(new Background())

        this.player = new Player();
        const spawnPoint = this.engine.nextSpawn
        // console.log(spawnPoint.x)
        // console.log(spawnPoint.y)
        this.player.pos = new Vector(spawnPoint.x, spawnPoint.y)
        this.add(this.player);

        this.dog = new Dog()
        this.dog.pos = this.player.pos
        this.add(this.dog)


        for (let i = 0; i < 10; i++) {
            const isReal = Math.random() > 0.25;
            
            this.placePropRandomly(new TableVertical(isReal));
        }


        for (let i = 0; i < 10; i++) {
            const isReal = Math.random() > 0.25;
            this.placePropRandomly(new TableHorizontal(isReal));
        }

        const testEnemy = new Enemy()
        this.add(testEnemy)


        this.camera.strategy.lockToActor(this.player)
        this.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, 3000, 2000))

    }

    placePropRandomly(propInstance) {
        const maxAttempts = 50;
        const padding = 10;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const randomX = randomInRange(300, 2600);
            const randomY = randomInRange(300, 1600);

            // Calculate proposed Bounding Box based on this specific prop's dimensions
            const halfW = (propInstance.width / 2) + padding;
            const halfH = (propInstance.height / 2) + padding;

            const proposedBox = new BoundingBox({
                left: randomX - halfW,
                top: randomY - halfH,
                right: randomX + halfW,
                bottom: randomY + halfH
            });

            // Check for overlaps with ALL already placed props
            let isOverlapping = false;
            for (const placed of this.placedProps) {
                const pW = (placed.width / 2) + padding;
                const pH = (placed.height / 2) + padding;

                const placedBox = new BoundingBox({
                    left: placed.pos.x - pW,
                    top: placed.pos.y - pH,
                    right: placed.pos.x + pW,
                    bottom: placed.pos.y + pH
                });

                if (proposedBox.intersect(placedBox)) {
                    isOverlapping = true;
                    break;
                }
            }

            // If no overlap, set position, save it, and add to scene
            if (!isOverlapping) {
                propInstance.pos = new Vector(randomX, randomY);
                this.placedProps.push(propInstance); // Add to the master list
                this.add(propInstance);
                return;
            }
        }

        console.warn("Could not find a free spot for a prop after 50 attempts!");
    }




}