import { Enemy } from "./Enemy.js";

/**
 * Speed Enemy - Nemico molto veloce ma fragile
 * Usa lo sprite della fly con tinta rossa
 */
export class SpeedEnemy extends Enemy {
  constructor(scene, x, y, texture = "fly") {
    super(scene, x, y, texture, {
      maxHP: 15,
      enemyDmg: 10,
      moveSpeed: 100,
      xpReward: 15
    });
    
    // Più piccolo e veloce
    this.setScale(0.9);
    this.setTint(0xff4444); // Rosso
    
    this.createAnimation(scene, "speed_run", texture, 0, 3, 10);
  }
  
  // Movimento zigzag
  moveTowardsPlayer() {
    if (!this.scene || !this.scene.player) return;
    
    // Aggiungi un po' di movimento casuale
    const zigzag = Math.sin(this.scene.time.now / 100) * 30;
    
    const angle = Phaser.Math.Angle.Between(
      this.x, this.y,
      this.scene.player.x + zigzag, this.scene.player.y
    );
    
    this.setVelocity(
      Math.cos(angle) * this.moveSpeed,
      Math.sin(angle) * this.moveSpeed
    );
    
    if (this.body.velocity.x < 0) {
      this.setFlipX(true);
    } else {
      this.setFlipX(false);
    }
  }
}
