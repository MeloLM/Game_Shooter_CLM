import { Physics } from "phaser";

/**
 * SlimeRed - Slime rosso aggressivo
 * Comportamento: veloce e aggressivo, meno HP
 * Stats: HP 30, DMG 30, Speed alto
 */
export class SlimeRed extends Physics.Arcade.Sprite {
  maxHP = 30;
  currentHP = 30;
  enemyDmg = 30; // Più danno
  moveSpeed = 55; // Molto veloce
  xpReward = 12;
  hpBar;

  constructor(scene, x, y) {
    super(scene, x, y, "slime_red_idle");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.hpBar = scene.add.graphics();
    this.updateHPBar();

    // Animazione idle
    if (!scene.anims.exists("slime_red_idle_anim")) {
      scene.anims.create({
        key: "slime_red_idle_anim",
        repeat: -1,
        frameRate: 10, // Più veloce
        frames: scene.anims.generateFrameNumbers("slime_red_idle", {
          start: 0,
          end: 3,
        })
      });
    }

    // Animazione run
    if (!scene.anims.exists("slime_red_run_anim")) {
      scene.anims.create({
        key: "slime_red_run_anim",
        repeat: -1,
        frameRate: 14, // Molto veloce
        frames: scene.anims.generateFrameNumbers("slime_red_run", {
          start: 0,
          end: 5,
        })
      });
    }

    // Animazione morte
    if (!scene.anims.exists("slime_red_death_anim")) {
      scene.anims.create({
        key: "slime_red_death_anim",
        repeat: 0,
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers("slime_red_death", {
          start: 0,
          end: 3,
        })
      });
    }

    this.play("slime_red_idle_anim");
    this.isMoving = false;
    
    // Leggermente più piccolo
    this.setScale(0.45);
    
    // Tinta rossa
    this.setTint(0xff4444);
  }

  updateHPBar() {
    if (!this.hpBar || !this.active) return;
    this.hpBar.clear();
    
    const barWidth = 18;
    const barHeight = 3;
    
    this.hpBar.fillStyle(0x808080, 1);
    this.hpBar.fillRect(this.x - barWidth / 2, this.y - 18, barWidth, barHeight);
    
    const hpPercent = this.currentHP / this.maxHP;
    let color = 0x00ff00;
    if (hpPercent < 0.3) color = 0xff0000;
    else if (hpPercent < 0.6) color = 0xffff00;
    
    this.hpBar.fillStyle(color, 1);
    this.hpBar.fillRect(this.x - barWidth / 2, this.y - 18, barWidth * hpPercent, barHeight);
  }

  update(player) {
    if (!this.active || !player) return;
    
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    
    // Movimento aggressivo con leggera oscillazione
    const wobble = Math.sin(this.scene.time.now / 100) * 10;
    
    this.body.setVelocity(
      Math.cos(angle) * this.moveSpeed + wobble,
      Math.sin(angle) * this.moveSpeed
    );
    
    this.flipX = this.body.velocity.x < 0;
    
    const moving = Math.abs(this.body.velocity.x) > 5 || Math.abs(this.body.velocity.y) > 5;
    if (moving && !this.isMoving) {
      this.play("slime_red_run_anim");
      this.isMoving = true;
    } else if (!moving && this.isMoving) {
      this.play("slime_red_idle_anim");
      this.isMoving = false;
    }
    
    this.updateHPBar();
  }

  takeDamage(dmg) {
    this.currentHP -= dmg;
    this.updateHPBar();
    
    this.setTint(0xffffff);
    this.scene.time.delayedCall(100, () => {
      if (this.active) this.setTint(0xff4444); // Torna rosso
    });
    
    return this.currentHP <= 0;
  }

  die() {
    this.body.setVelocity(0, 0);
    this.clearTint();
    this.play("slime_red_death_anim");
    
    // Salva riferimento per la callback
    const scene = this.scene;
    const hpBar = this.hpBar;
    const self = this;
    
    this.once('animationcomplete', () => {
      if (hpBar) hpBar.destroy();
      if (scene && scene.enemies) {
        const index = scene.enemies.indexOf(self);
        if (index > -1) scene.enemies.splice(index, 1);
      }
      self.destroy();
    });
  }
}
