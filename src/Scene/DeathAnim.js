import { Physics } from "phaser";

export class DeathAnim extends Physics.Arcade.Sprite{

  constructor(scene, x, y, texture = "death"){
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(0.5);// size of death animation sprite

    scene.time.addEvent({
      delay: 1000,
      callback: ()=> this.destroy()
    });

    // Controlla se l'animazione esiste già
    if (!scene.anims.exists("death")) {
      scene.anims.create({
        key: "death",      
        frameRate: 8,
        frames: scene.anims.generateFrameNumbers(texture, {
          start: 0,
          end: 7,
        })
      });
    }

    this.play("death");
  }
}