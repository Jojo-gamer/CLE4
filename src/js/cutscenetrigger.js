import { Actor, CollisionType, Color, Font, Keys, Label, ScreenElement, SpriteSheet, Animation, range, TextAlign, Vector } from "excalibur";
import { Message } from "./message";

export class CutSceneTrigger extends Actor {
  constructor({ resource, columns, spriteWidth, spriteHeight, frameTime = 2000, message }) {
    super({
      width: 0,
      height: 0,
      color: Color.Transparent,
    });
    this.body.collisionType = CollisionType.Passive;
    this.hasPlayed = false;

    this.resource = resource;
    this.columns = columns;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.frameTime = frameTime;
    this.showMessage = message;
  }

  // ✅ Geen onInitialize meer - alles wordt aangemaakt in startStory

  async startStory(engine, speler) {
    if (this.hasPlayed) return;
    this.hasPlayed = true;

    this.gamepad = engine.gamepad ?? engine.input.gamepads.at(0);

    speler.isCutscenePlaying = true;
    let skip = false;

    // ✅ Listener om de cutscene te skippen met SPATIE
    const skipHandler = (evt) => {
      if (evt.key === Keys.Space) {
        skip = true;
      }
    };
    engine.input.keyboard.on("press", skipHandler);

    const gamepadSkipHandler = (evt) => {
      if (evt.button === Buttons.Face4) {
        skip = true;
      }
    };
    if (this.gamepad) {
      this.gamepad.on("button", gamepadSkipHandler);
    }

    const cutsceneScreen = new ScreenElement({
      x: 0,
      y: 0,
      z: 1000,
      anchor: Vector.Zero,
    });
    engine.add(cutsceneScreen);

    const sheet = SpriteSheet.fromImageSource({
      image: this.resource,
      grid: { rows: 1, columns: 4, spriteWidth: 1920, spriteHeight: 1080 },
    });
    const animation = Animation.fromSpriteSheet(
      sheet,
      range(0, 3),
      this.frameTime,
    );
    animation.scale = new Vector(0.7, 0.7);

    cutsceneScreen.graphics.use(animation);

    // ✅ Wacht, MAAR check constant of er geskipt wordt
    // We wachten niet in één keer 8 seconden, maar in kleine stapjes
    for (let i = 0; i < (this.columns * this.frameTime / 100); i++) {
      await this.wait(95);
      if (skip) break;
    }

    cutsceneScreen.graphics.hide();

    // ✅ Hint label (Alleen als er niet geskipt is, of toon het alsnog kort)
    // if (this.showSpacebarHint && !skip) {
    //   const hintLabel = new Label({
    //     text: "Druk op SPATIE om de realiteit te checken",
    //     pos: new Vector(engine.halfDrawWidth, engine.drawHeight - 60),
    //     font: new Font({ size: 24, color: Color.White, textAlign: TextAlign.Center, family: 'Arial' })
    //   });
    //   engine.add(hintLabel);

    //   await new Promise(resolve => {
    //     const check = setInterval(() => {
    //       if (engine.input.keyboard.wasPressed(Keys.Space) || skip || this.gamepad.isButtonPressed(Buttons.Face4)) {
    //         clearInterval(check);
    //         resolve();
    //       }
    //     }, 100);
    //   });
    //   hintLabel.kill();
    // }

    // ✅ Cleanup
    engine.input.keyboard.off("press", skipHandler); // Belangrijk: haal de listener weg!
    if (this.gamepad) {
      this.gamepad.off("button", gamepadSkipHandler);
    }
    cutsceneScreen.kill();
    speler.isCutscenePlaying = false;
    this.scene.add(new Message(this.showMessage))
  }

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
