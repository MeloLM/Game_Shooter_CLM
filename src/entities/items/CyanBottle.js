import { Physics } from "phaser";

/**
 * CyanBottle - Pozione che attiva l'arma Boomerang
 * Usa la texture della pozione blu con tinta cyan
 */
export class CyanBottle extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture = "blue_potion") {
    super(scene, x, y, texture);
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setScale(0.5);
    this.setTint(0x00ffff); // Cyan
    
    if (!scene.anims.exists("cPotion")) {
      scene.anims.create({
        key: "cPotion",
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNumbers(texture, {
          start: 0,
          end: 7,
        })
      });
    }
    
    this.setCollideWorldBounds(true);
    this.play("cPotion");
  }
}
