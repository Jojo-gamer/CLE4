import { Color, Font, FontUnit, Keys, Label, Scene, Vector } from "excalibur";
import { Resources } from "./resources";
export class GameOver extends Scene {
    #scoreLabel;

    onInitialize() {
        let message = new Label({
            text: 'Game Over',
            pos: new Vector(640, 320),
            font: new Font({
                family: 'Arial',
                size: 74,
                unit: FontUnit.Px,
                color: Color.White
            }),
        })
        message.graphics.use(Resources.GameOver.toSprite())
        message.graphics.scale = new Vector (3,3)
        message.graphics.anchor = new Vector(0.5, 0.5)
        this.add(message)

        let hints = new Label({
            text: 'Press [Space] to restart',
            pos: new Vector(640, 50),
            font: new Font({
                family: 'Arial',
                size: 30,
                unit: FontUnit.Px,
                color: Color.White
            }),
        })
        hints.graphics.anchor = new Vector(0.5, 0.5)
        this.add(hints)

        this.scoreLabel = new Label({
            text: '',
            pos: new Vector(640, 400),
            font: new Font({
                family: 'Arial',
                size: 20,   
                unit: FontUnit.Px,
                color: Color.Black
            }),
        })
        this.scoreLabel.graphics.anchor = new Vector(0.5, 0.5)
        this.add(this.scoreLabel)
    }

    onActivate(ctx) {
        const TimeScore = ctx.data.TimeScore
        console.log(`timescore: ${TimeScore}`)
        this.scoreLabel.text = `Je hebt het ${TimeScore} seconden overleefd!`
    }

    onPreUpdate(engine) {
        if (engine.input.keyboard.wasPressed(Keys.Space)) {
            // Activeer de grote schoonmaak!
            engine.resetGame();
        }
    }
}