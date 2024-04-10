import { Physics } from "phaser";

export class Beam extends Physics.Arcade.Sprite{
  speed = 100; 
  
  constructor(pointer, scene, x, y, angle, texture = "laser"){
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.moveTo(this, pointer.worldX, pointer.worldY, this.speed);
    
    this.rotation = angle;
    scene.time.addEvent({
      delay: 7000,
      callback: ()=> this.destroy()
    });

    scene.anims.create({
      key: "laser",
      repeat: -1,
      frameRate: 4,
      frames: scene.anims.generateFrameNumbers(texture, {
        start: 0,
        end: 3,
      })
    });

    this.play("laser");

  }
    die(){
		  this.scene.attacks.splice(this.scene.attacks.indexOf(this),1)
		  this.destroy();
	  }
}