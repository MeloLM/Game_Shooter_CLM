import { Physics } from "phaser";

export class Shield extends Physics.Arcade.Sprite{
  
  constructor(scene, x, y, texture = "shield1"){
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    scene.time.addEvent({
      delay: 7000,
      callback: ()=> this.destroy()
    });

    scene.anims.create({
      key: "shield",
      repeat: -1,
      frameRate: 6,
      frames: scene.anims.generateFrameNumbers(texture, {
        start: 0,
        end: 5,
      })
    });


  }
}