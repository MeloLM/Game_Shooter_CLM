import { Physics } from "phaser";

export class Shield extends Physics.Arcade.Sprite{
  
  constructor(scene, x, y, texture = "shield1"){
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(0.35);
    this.body.setSize(50, 50);
    this.body.setOffset(-8, 10)

    scene.time.addEvent({
      delay: 7000,
      callback: ()=> this.destroy()
    });

    scene.anims.create({
      key: "shield",
      repeat: -1,
      frameRate: 6,
      frames: scene.anims.generateFrameNumbers(texture, {
        start: 3,
        end: 5,
      })
    });

    this.play("shield");
  }
  updatePosition(x, y) {
    this.setPosition(x + 5 , y);
  }
}