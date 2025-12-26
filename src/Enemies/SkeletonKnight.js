/**
 * SkeletonKnight - Nemico scheletro cavaliere
 * Comportamento: Resistente, attacchi potenti, appare nelle wave avanzate
 * Stats: HP 80, DMG 35, Speed medio
 */
export class SkeletonKnight extends Phaser.Physics.Arcade.Sprite {
  maxHP = 80;
  currentHP = 80;
  enemyDmg = 35;
  moveSpeed = 35;
  xpReward = 25;
  hpBar;
  
  // Stato attacco
  attackRange = 40;
  attackCooldown = 1500;
  lastAttackTime = 0;
  isAttacking = false;

  constructor(scene, x, y) {
    super(scene, x, y, "skeleton_idle");

    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setScale(0.6);
    this.body.setSize(30, 40);

    this.hpBar = scene.add.graphics();
    this.updateHPBar();

    // Animazione idle
    if (!scene.anims.exists("skeleton_idle_anim")) {
      scene.anims.create({
        key: "skeleton_idle_anim",
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNumbers("skeleton_idle", {
          start: 0,
          end: 7,
        })
      });
    }

    // Animazione walk
    if (!scene.anims.exists("skeleton_walk_anim")) {
      scene.anims.create({
        key: "skeleton_walk_anim",
        repeat: -1,
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers("skeleton_walk", {
          start: 0,
          end: 7,
        })
      });
    }

    // Animazione attacco
    if (!scene.anims.exists("skeleton_attack_anim")) {
      scene.anims.create({
        key: "skeleton_attack_anim",
        repeat: 0,
        frameRate: 12,
        frames: scene.anims.generateFrameNumbers("skeleton_attack", {
          start: 0,
          end: 5,
        })
      });
    }

    // Animazione morte
    if (!scene.anims.exists("skeleton_death_anim")) {
      scene.anims.create({
        key: "skeleton_death_anim",
        repeat: 0,
        frameRate: 8,
        frames: scene.anims.generateFrameNumbers("skeleton_death", {
          start: 0,
          end: 7,
        })
      });
    }

    this.play("skeleton_idle_anim");
    this.isMoving = false;
  }

  updateHPBar() {
    if (!this.hpBar || !this.active) return;
    this.hpBar.clear();
    
    const barWidth = 24;
    const barHeight = 3;
    
    this.hpBar.fillStyle(0x808080, 1);
    this.hpBar.fillRect(this.x - barWidth / 2, this.y - 25, barWidth, barHeight);
    
    const hpPercent = this.currentHP / this.maxHP;
    let color = 0x00ff00;
    if (hpPercent < 0.3) color = 0xff0000;
    else if (hpPercent < 0.6) color = 0xffff00;
    
    this.hpBar.fillStyle(color, 1);
    this.hpBar.fillRect(this.x - barWidth / 2, this.y - 25, barWidth * hpPercent, barHeight);
  }

  update(player) {
    if (!this.active || !player) return;
    if (this.isAttacking) return;
    
    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    const now = this.scene.time.now;
    
    // Attacca se vicino
    if (distance < this.attackRange && now - this.lastAttackTime > this.attackCooldown) {
      this.attack();
      return;
    }
    
    // Muoviti verso il player
    this.body.setVelocity(
      Math.cos(angle) * this.moveSpeed,
      Math.sin(angle) * this.moveSpeed
    );
    
    this.flipX = this.body.velocity.x < 0;
    
    const moving = Math.abs(this.body.velocity.x) > 5 || Math.abs(this.body.velocity.y) > 5;
    if (moving && !this.isMoving) {
      this.play("skeleton_walk_anim");
      this.isMoving = true;
    } else if (!moving && this.isMoving) {
      this.play("skeleton_idle_anim");
      this.isMoving = false;
    }
    
    this.updateHPBar();
  }

  attack() {
    this.isAttacking = true;
    this.lastAttackTime = this.scene.time.now;
    this.body.setVelocity(0, 0);
    
    this.play("skeleton_attack_anim");
    
    this.once('animationcomplete', () => {
      this.isAttacking = false;
      this.isMoving = false;
      this.play("skeleton_idle_anim");
    });
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
    this.body.setVelocity(0, 0);
    this.play("skeleton_death_anim");
    
    this.once('animationcomplete', () => {
      if (this.hpBar) this.hpBar.destroy();
      const index = this.scene.enemies.indexOf(this);
      if (index > -1) this.scene.enemies.splice(index, 1);
      this.destroy();
    });
  }
}
