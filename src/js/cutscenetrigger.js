import { Actor, CollisionType, Color, ScreenElement, Vector } from "excalibur";
import { Resources } from './resources.js';

export class CutSceneTrigger extends Actor {
  constructor(x, y, width, height) {
    super({
      x,
      y,
      width,
      height,
      color: Color.Transparent 
      
    });

    this.body.collisionType = CollisionType.Passive;
    
    
    this.hasPlayed = false; 
  }

  onInitialize(engine) {
    
    this.cutsceneScreen = new ScreenElement({
        x: engine.halfDrawWidth,
        y: engine.halfDrawHeight,
        z: 100 
    });
    engine.add(this.cutsceneScreen);

    // De collision check
    this.on("collisionstart", (evt) => {
     
      if (evt.other.owner.name === "player" && !this.hasPlayed) {
        
        this.hasPlayed = true; 
        
        
        this.startStory(engine, evt.other.owner);
      }
    });
  }


  async startStory(engine, speler) {
      player.canMove = false; 

      const readTime = 5000; 


      this.cutsceneScreen.graphics.use(Resources.Cutscene1.toSprite());
      await this.wait(readTime); 

     
      this.cutsceneScreen.graphics.use(Resources.Cutscene2.toSprite());
      await this.wait(readTime);

    
      this.cutsceneScreen.graphics.use(Resources.Cutscene3.toSprite());
      await this.wait(readTime);

      
      this.cutsceneScreen.graphics.hide();

      player.canMove = true;
  }

  
  wait(milliseconds) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
}