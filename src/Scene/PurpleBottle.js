import { Physics } from "phaser";

export class PurpleBottle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, enemies, texture = "purple_potion") {
      super(scene, x, y, texture);
      
      this.scene.enemies = enemies;

      scene.add.existing(this);
      scene.physics.add.existing(this);
      scene.physics.world.enable(this);
      
      // Imposta le dimensioni dell'oggetto
      this.setScale(0.5);
      
      scene.anims.create({
      key: "pPotion",
      repeat: -1,
      frameRate: 8,
      frames: scene.anims.generateFrameNumbers(texture, {
        start: 0,
        end: 7,
      }),

      
    });

    
      
      // Attiva la collisione con il giocatore
      this.setCollideWorldBounds(true);
      
      
      this.play("pPotion");
    }
    applyToEnemies() {
      // Itera attraverso tutti gli nemici presenti nella scena
      this.enemies.forEach((enemy) => {
      // Applica la funzione die() all'nemico
      enemy.die();
      });
    }

}
