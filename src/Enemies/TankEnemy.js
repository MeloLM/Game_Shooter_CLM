import { Enemy } from "./Enemy.js";

/**
 * Tank Enemy - Nemico lento ma molto resistente
 * Usa lo sprite del goblin (più grande) con tinta diversa
 */
export class TankEnemy extends Enemy {
  constructor(scene, x, y, texture = "goblin") {
    super(scene, x, y, texture, {
      maxHP: 150,
      enemyDmg: 40,
      moveSpeed: 25,
      xpReward: 30
    });
    
    // Sprite più grande
    this.setScale(1.3);
    this.setTint(0x8B4513); // Marrone scuro
    
    this.createAnimation(scene, "tank_run", texture, 0, 5, 4);
  }
  
  updateHPBar() {
    if (!this.hpBar || !this.active) return;
    this.hpBar.clear();
    
    // Barra più grande per il tank
    const barWidth = 18;
    const barHeight = 3;
    
    this.hpBar.fillStyle(0x808080, 1);
    this.hpBar.fillRect(this.x - barWidth / 2, this.y - 14, barWidth, barHeight);
    
    const hpPercent = this.currentHP / this.maxHP;
    let color = 0x8B4513; // Marrone
    if (hpPercent < 0.3) color = 0xff0000;
    
    this.hpBar.fillStyle(color, 1);
    const hpWidth = barWidth * hpPercent;
    this.hpBar.fillRect(this.x - barWidth / 2, this.y - 14, hpWidth, barHeight);
  }
}
