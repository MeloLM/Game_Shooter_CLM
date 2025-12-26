import { Physics } from "phaser";

export class Thunder extends Physics.Arcade.Sprite{

  constructor(scene, x, y, texture = "thunder"){
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(0.5);// size of thunder animation sprite

    scene.time.addEvent({
      delay: 1000,
      callback: ()=> this.destroy()
    });

    // Controlla se l'animazione esiste già
    if (!scene.anims.exists("thunder")) {
      scene.anims.create({
        key: "thunder",   
        frameRate: 9,
        frames: scene.anims.generateFrameNumbers(texture, {
          start: 2,
          end: 8,
        })
      });
    }

    this.play("thunder");
  }
}