import { Physics } from "phaser";

/**
 * OrangeBottle - Pozione che attiva l'arma Shotgun
 * Usa la texture della pozione gialla con tinta arancione
 */
export class OrangeBottle extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture = "yellow_potion") {
    super(scene, x, y, texture);
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setScale(0.5);
    this.setTint(0xff8800); // Arancione
    
    if (!scene.anims.exists("oPotion")) {
      scene.anims.create({
        key: "oPotion",
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNumbers(texture, {
          start: 0,
          end: 7,
        })
      });
    }
    
    this.setCollideWorldBounds(true);
    this.play("oPotion");
  }
}
