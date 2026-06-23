import { Actor, Engine, Vector, DisplayMode, BoundingBox, Color, SolverStrategy, Timer, Scene, randomInRange } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Background } from "./background.js"
import { DoorTrigger } from "./doorTrigger.js";
import { Player } from "./player.js";
import { TableVertical } from "./tablevertical.js";
import { TableHorizontal } from "./tablehorizontal.js";
import { Dog } from './dog.js'
import { Enemy } from "./enemy.js";
import { CourtYard } from "./courtyard.js";


export class Cafetaria extends Scene {
    isReal;
    currentScene;
    constructor() {
        const sceneWidth = 3000
        const sceneHeight = 2000

        super({
            width: sceneWidth,
            height: sceneHeight,
            color: Color.Black
        });

        this.placedProps = [];
        this.sceneWidth = sceneWidth
        this.sceneHeight = sceneHeight
    }
    onInitialize(engine) {
        this.location = engine.currentSceneName
        this.add(new Background(this.sceneWidth, this.sceneHeight, this.location))

        this.player = new Player();
        const spawnPoint = this.engine.nextSpawn
        this.player.pos = new Vector(spawnPoint.x, spawnPoint.y)
        this.add(this.player);

        this.dog = new Dog()
        this.dog.pos = this.player.pos
        this.add(this.dog)

        for (let i = 0; i < 5; i++) {
            const isReal = Math.random() > 0.25;
            const enemy = new Enemy(isReal)
            this.add(enemy)
        }

        this.camera.strategy.lockToActor(this.player)
        this.camera.strategy.limitCameraBounds(new BoundingBox(0, 0, this.sceneWidth, this.sceneHeight))

       

        this.add(new DoorTrigger(140, 1300, 50, 150, "EastHallWay", 1300, 5350));

        this.add(new DoorTrigger(1500, 1850, 150, 50, "Reception", 500, 400));

        this.add(new DoorTrigger(130, 1000, 50, 150, "EastWing", 2200, 310, 'left', false));
        
        this.add(new DoorTrigger(1500, 140, 150, 50, "CourtYard", 1500, 1940, 'up', false));
    }

    onActivate(ctx) {


        const spawnPoint = this.engine.nextSpawn || { x: 400, y: 500 };
        this.player.pos = new Vector(spawnPoint.x, spawnPoint.y);
        this.dog.pos = new Vector(this.player.pos.x, this.player.pos.y);


        this.clearProps();

        this.placePropRandomly(new TableHorizontal(false, true, 0))
        this.placePropRandomly(new TableHorizontal(false, true, 1))

        for (let i = 0; i < 15; i++) {
            const isReal = Math.random() > 0.25;
            this.placePropRandomly(new TableVertical(isReal));
        }

        for (let i = 0; i < 15; i++) {
            const isReal = Math.random() > 0.25;
            this.placePropRandomly(new TableHorizontal(isReal));
        }

    }

    clearProps() {

        this.placedProps.forEach(prop => {
            prop.kill();
        });


        this.placedProps = [];
    }

    onPreUpdate(engine, delta) {
        this.playerOutOfBounds();
        this.playerInBounds();
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

    playerOutOfBounds() {
        if (this.player.pos.x < 150 || this.player.pos.x > 2798 || this.player.pos.y < 170 || this.player.pos.y > 1760 ) {
            
            
            if (!Resources.OutOfBoundsSound.isPlaying()) {
                Resources.OutOfBoundsSound.play();
            }
        }
    }

    playerInBounds() {
        
        if (this.player.pos.x > 157 && this.player.pos.x < 2790 && this.player.pos.y > 176 && this.player.pos.y < 1745 ) {
            
           
            if (Resources.OutOfBoundsSound.isPlaying()) {
                Resources.OutOfBoundsSound.stop();
            }
        }
    }
}