import { Physics } from "phaser";

export class BlueBottle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = "blue_potion") {
      super(scene, x, y, texture);
      
      scene.add.existing(this);
      scene.physics.add.existing(this);
      
      // Imposta le dimensioni dell'oggetto
      this.setScale(0.5);
      
      scene.anims.create({
      key: "bPotion",
      repeat: -1,
      frameRate: 8,
      frames: scene.anims.generateFrameNumbers(texture, {
        start: 0,
        end: 7,
      })

    });
      
      // Attiva la collisione con il giocatore
      this.setCollideWorldBounds(true);
      
      
      this.play("bPotion");
    }
    

}
