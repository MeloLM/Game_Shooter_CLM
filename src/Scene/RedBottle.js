import { Physics } from "phaser";

export class RedBottle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = "potion") {
      super(scene, x, y, texture);
      
      scene.add.existing(this);
      scene.physics.add.existing(this);
      
      // Imposta le dimensioni dell'oggetto
      this.setScale(0.5);
      
      // Controlla se l'animazione esiste già
      if (!scene.anims.exists("potion")) {
        scene.anims.create({
          key: "potion",
          repeat: -1,
          frameRate: 8,
          frames: scene.anims.generateFrameNumbers(texture, {
            start: 0,
            end: 7,
          })
        });
      }
      
      // Attiva la collisione con il giocatore
      this.setCollideWorldBounds(true);
      
      
      this.play("potion");
    }
    

}
