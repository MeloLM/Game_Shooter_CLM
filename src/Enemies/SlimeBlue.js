import { Physics } from "phaser";

/**
 * SlimeBlue - Slime blu più resistente
 * Comportamento: più lento ma più tanky
 * Stats: HP 50, DMG 25, Speed basso
 */
export class SlimeBlue extends Physics.Arcade.Sprite {
  maxHP = 50;
  currentHP = 50;
  enemyDmg = 25;
  moveSpeed = 30; // Più lento
  xpReward = 15;
  hpBar;

  constructor(scene, x, y) {
    super(scene, x, y, "slime_blue_idle");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.hpBar = scene.add.graphics();
    this.updateHPBar();

    // Animazione idle
    if (!scene.anims.exists("slime_blue_idle_anim")) {
      scene.anims.create({
        key: "slime_blue_idle_anim",
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNumbers("slime_blue_idle", {
          start: 0,
          end: 3,
        })
      });
    }

    // Animazione run
    if (!scene.anims.exists("slime_blue_run_anim")) {
      scene.anims.create({
        key: "slime_blue_run_anim",
        repeat: -1,
        frameRate: 8, // Più lento
        frames: scene.anims.generateFrameNumbers("slime_blue_run", {
          start: 0,
          end: 5,
        })
      });
    }

    // Animazione morte
    if (!scene.anims.exists("slime_blue_death_anim")) {
      scene.anims.create({
        key: "slime_blue_death_anim",
        repeat: 0,
        frameRate: 8,
        frames: scene.anims.generateFrameNumbers("slime_blue_death", {
          start: 0,
          end: 3,
        })
      });
    }

    this.play("slime_blue_idle_anim");
    this.isMoving = false;
    
    // Leggermente più grande
    this.setScale(0.55);
    
    // Tinta blu
    this.setTint(0x6699ff);
  }

  updateHPBar() {
    if (!this.hpBar || !this.active) return;
    this.hpBar.clear();
    
    const barWidth = 22;
    const barHeight = 3;
    
    this.hpBar.fillStyle(0x808080, 1);
    this.hpBar.fillRect(this.x - barWidth / 2, this.y - 22, barWidth, barHeight);
    
    const hpPercent = this.currentHP / this.maxHP;
    let color = 0x00ff00;
    if (hpPercent < 0.3) color = 0xff0000;
    else if (hpPercent < 0.6) color = 0xffff00;
    
    this.hpBar.fillStyle(color, 1);
    this.hpBar.fillRect(this.x - barWidth / 2, this.y - 22, barWidth * hpPercent, barHeight);
  }

  update(player) {
    if (!this.active || !player) return;
    
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    this.body.setVelocity(
      Math.cos(angle) * this.moveSpeed,
      Math.sin(angle) * this.moveSpeed
    );
    
    this.flipX = this.body.velocity.x < 0;
    
    const moving = Math.abs(this.body.velocity.x) > 5 || Math.abs(this.body.velocity.y) > 5;
    if (moving && !this.isMoving) {
      this.play("slime_blue_run_anim");
      this.isMoving = true;
    } else if (!moving && this.isMoving) {
      this.play("slime_blue_idle_anim");
      this.isMoving = false;
    }
    
    this.updateHPBar();
  }

  takeDamage(dmg) {
    this.currentHP -= dmg;
    this.updateHPBar();
    
    this.setTint(0xffffff);
    this.scene.time.delayedCall(100, () => {
      if (this.active) this.setTint(0x6699ff); // Torna blu
    });
    
    return this.currentHP <= 0;
  }

  die() {
    this.body.setVelocity(0, 0);
    this.clearTint();
    this.play("slime_blue_death_anim");
    
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
