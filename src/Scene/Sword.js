import { Physics } from "phaser";

export class Sword extends Physics.Arcade.Sprite{

  constructor(pointer, scene, x, y, angle, texture = "sword"){
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.moveTo(this, pointer.worldX, pointer.worldY);

    this.rotation = angle;

    scene.time.addEvent({
      delay: 5000,
      callback: ()=> this.destroy()
    });

    scene.anims.create({
      key: "attack",
      repeat: -1,
      frameRate: 3,
      frames: scene.anims.generateFrameNumbers(texture, {
        start: 0,
        end: 2,
      })
    });

    this.play("attack");

  }
    die(){
		  this.scene.attacks.splice(this.scene.attacks.indexOf(this),1)
		  this.destroy();
	  }
}