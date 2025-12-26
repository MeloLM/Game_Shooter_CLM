import { Physics } from "phaser";

/**
 * SlimeGreen - Slime verde standard
 * Comportamento: insegue il player normalmente
 * Stats: HP 40, DMG 20, Speed medio
 */
export class SlimeGreen extends Physics.Arcade.Sprite {
  maxHP = 40;
  currentHP = 40;
  enemyDmg = 20;
  moveSpeed = 40;
  xpReward = 10;
  hpBar;

  constructor(scene, x, y) {
    super(scene, x, y, "slime_green_idle");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Barra HP
    this.hpBar = scene.add.graphics();
    this.updateHPBar();

    // Animazione idle
    if (!scene.anims.exists("slime_green_idle_anim")) {
      scene.anims.create({
        key: "slime_green_idle_anim",
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNumbers("slime_green_idle", {
          start: 0,
          end: 3,
        })
      });
    }

    // Animazione run
    if (!scene.anims.exists("slime_green_run_anim")) {
      scene.anims.create({
        key: "slime_green_run_anim",
        repeat: -1,
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers("slime_green_run", {
          start: 0,
          end: 5,
        })
      });
    }

    // Animazione morte
    if (!scene.anims.exists("slime_green_death_anim")) {
      scene.anims.create({
        key: "slime_green_death_anim",
        repeat: 0,
        frameRate: 8,
        frames: scene.anims.generateFrameNumbers("slime_green_death", {
          start: 0,
          end: 3,
        })
      });
    }

    this.play("slime_green_idle_anim");
    this.isMoving = false;
    
    // Scale per adattare lo sprite
    this.setScale(0.5);
  }

  updateHPBar() {
    if (!this.hpBar || !this.active) return;
    this.hpBar.clear();
    
    const barWidth = 20;
    const barHeight = 3;
    
    // Sfondo
    this.hpBar.fillStyle(0x808080, 1);
    this.hpBar.fillRect(this.x - barWidth / 2, this.y - 20, barWidth, barHeight);
    
    // HP
    const hpPercent = this.currentHP / this.maxHP;
    let color = 0x00ff00;
    if (hpPercent < 0.3) color = 0xff0000;
    else if (hpPercent < 0.6) color = 0xffff00;
    
    this.hpBar.fillStyle(color, 1);
    this.hpBar.fillRect(this.x - barWidth / 2, this.y - 20, barWidth * hpPercent, barHeight);
  }

  update(player) {
    if (!this.active || !player) return;
    
    // Muoviti verso il player
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    this.body.setVelocity(
      Math.cos(angle) * this.moveSpeed,
      Math.sin(angle) * this.moveSpeed
    );
    
    // Flip sprite in base alla direzione
    this.flipX = this.body.velocity.x < 0;
    
    // Cambia animazione se in movimento
    const moving = Math.abs(this.body.velocity.x) > 5 || Math.abs(this.body.velocity.y) > 5;
    if (moving && !this.isMoving) {
      this.play("slime_green_run_anim");
      this.isMoving = true;
    } else if (!moving && this.isMoving) {
      this.play("slime_green_idle_anim");
      this.isMoving = false;
    }
    
    this.updateHPBar();
  }

  takeDamage(dmg) {
    this.currentHP -= dmg;
    this.updateHPBar();
    
    // Flash bianco
    this.setTint(0xffffff);
    this.scene.time.delayedCall(100, () => {
      if (this.active) this.clearTint();
    });
    
    return this.currentHP <= 0;
  }

  die() {
    // Animazione morte
    this.body.setVelocity(0, 0);
    this.play("slime_green_death_anim");
    
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
