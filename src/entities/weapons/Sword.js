import { Physics } from "phaser";

export class Sword extends Physics.Arcade.Sprite{

  constructor(pointer, scene, x, y, angle, texture = "sword"){
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.moveTo(this, pointer.worldX, pointer.worldY);

    this.body.setSize(10, 15);      
    this.rotation = angle;

    scene.time.addEvent({
      delay: 5000,
      callback: () => {
        // Rimuovi dall'array prima di distruggere
        scene.attacks = scene.attacks.filter(a => a !== this);
        this.destroy();
      }
    });

    if (!scene.anims.exists("attack")) {
      scene.anims.create({
        key: "attack",
        repeat: -1,
        frameRate: 3,
        frames: scene.anims.generateFrameNumbers(texture, {
          start: 0,
          end: 2,
        })
      });
    }

    this.play("attack");
  }
}