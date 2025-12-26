import { Physics } from "phaser";

export class Slime extends Physics.Arcade.Sprite{
  maxHP = 40;
  currentHP = 40;
  enemyDmg = 20;
  hpBar;

  constructor(scene, x, y, texture = "slime"){
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Barra HP del nemico
    this.hpBar = scene.add.graphics();
    this.updateHPBar();

    if (!scene.anims.exists("slime_run")) {
      scene.anims.create({
        key: "slime_run",
        repeat: -1,
        frameRate: 6,
        frames: scene.anims.generateFrameNumbers(texture, {
          start: 0,
          end: 5,
        })
      });
    }

    this.play("slime_run");
    
    // Hitbox piccola e centrata
    this.body.setSize(20, 16);
    this.body.setOffset(6, 8);
  }

  updateHPBar() {
    if (!this.hpBar || !this.active) return;
    this.hpBar.clear();
    
    // Sfondo grigio
    this.hpBar.fillStyle(0x808080, 1);
    const barWidth = 12;
    const barHeight = 2;
    this.hpBar.fillRect(this.x - barWidth / 2, this.y - 10, barWidth, barHeight);
    
    // Barra HP verde
    this.hpBar.fillStyle(0x00ff00, 1);
    const hpWidth = barWidth * (this.currentHP / this.maxHP);
    this.hpBar.fillRect(this.x - barWidth / 2, this.y - 10, hpWidth, barHeight);
  }

  takeDamage(dmg) {
    this.currentHP -= dmg;
    this.updateHPBar();
    
    if (this.currentHP <= 0) {
      return true; // Nemico morto
    }
    return false;
  }

  die() {
    if (this.hpBar) {
      this.hpBar.destroy();
    }
    this.scene.enemies.splice(this.scene.enemies.indexOf(this), 1);
    this.destroy();
  }
}