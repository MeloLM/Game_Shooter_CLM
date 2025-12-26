import { Physics } from "phaser";

/**
 * OrcBoss - Boss che appare alla wave 20, 40, 60...
 * Comportamento: Molto resistente, carica verso il player
 * Stats: HP 750, DMG 60, attacco a carica
 */
export class OrcBoss extends Physics.Arcade.Sprite {
  maxHP = 750;
  currentHP = 750;
  enemyDmg = 60;
  moveSpeed = 30;
  xpReward = 350;
  hpBar;
  isBoss = true;
  bossName = "Orc Warlord";
  
  // Stati
  attackCooldown = 3000;
  lastAttackTime = 0;
  isAttacking = false;
  isCharging = false;
  chargeSpeed = 180;
  chargeDirection = { x: 0, y: 0 };

  constructor(scene, x, y) {
    super(scene, x, y, "boss_orc_idle");

    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Boss scala ridotta per visibilità
    this.setScale(0.7);
    this.body.setSize(50, 60);

    this.hpBar = scene.add.graphics();
    this.updateHPBar();

    // Animazione idle
    if (!scene.anims.exists("boss_orc_idle_anim")) {
      scene.anims.create({
        key: "boss_orc_idle_anim",
        repeat: -1,
        frameRate: 6,
        frames: scene.anims.generateFrameNumbers("boss_orc_idle", {
          start: 0,
          end: 5,
        })
      });
    }

    // Animazione walk
    if (!scene.anims.exists("boss_orc_walk_anim")) {
      scene.anims.create({
        key: "boss_orc_walk_anim",
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNumbers("boss_orc_walk", {
          start: 0,
          end: 5,
        })
      });
    }

    // Animazione run (carica)
    if (!scene.anims.exists("boss_orc_run_anim")) {
      scene.anims.create({
        key: "boss_orc_run_anim",
        repeat: -1,
        frameRate: 12,
        frames: scene.anims.generateFrameNumbers("boss_orc_run", {
          start: 0,
          end: 5,
        })
      });
    }

    // Animazione attacco
    if (!scene.anims.exists("boss_orc_attack_anim")) {
      scene.anims.create({
        key: "boss_orc_attack_anim",
        repeat: 0,
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers("boss_orc_attack", {
          start: 0,
          end: 5,
        })
      });
    }

    // Animazione morte
    if (!scene.anims.exists("boss_orc_death_anim")) {
      scene.anims.create({
        key: "boss_orc_death_anim",
        repeat: 0,
        frameRate: 6,
        frames: scene.anims.generateFrameNumbers("boss_orc_death", {
          start: 0,
          end: 5,
        })
      });
    }

    this.play("boss_orc_idle_anim");
    this.isMoving = false;
    
    // Annuncia il boss!
    this.showBossIntro(scene);
  }

  showBossIntro(scene) {
    const bossText = scene.add.text(320, 50, '💀 BOSS: ORC WARLORD 💀', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#ff2222',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    });
    bossText.setOrigin(0.5);
    bossText.setScrollFactor(0);
    bossText.setDepth(1000);
    
    // Screen shake all'arrivo
    scene.cameras.main.shake(300, 0.015);
    
    scene.tweens.add({
      targets: bossText,
      alpha: 0.2,
      duration: 250,
      yoyo: true,
      repeat: 6,
      onComplete: () => bossText.destroy()
    });
  }

  updateHPBar() {
    if (!this.hpBar || !this.active) return;
    this.hpBar.clear();
    
    const barWidth = 220;
    const barHeight = 14;
    const barX = 210;
    const barY = 12;
    
    // Sfondo
    this.hpBar.fillStyle(0x222222, 1);
    this.hpBar.fillRect(barX, barY, barWidth, barHeight);
    
    // Bordo dorato per boss forte
    this.hpBar.lineStyle(2, 0xffaa00, 1);
    this.hpBar.strokeRect(barX, barY, barWidth, barHeight);
    
    // HP
    const hpPercent = this.currentHP / this.maxHP;
    let color = 0xaa0000;
    if (hpPercent < 0.25) {
      color = 0x550000;
      // Enraged quando basso HP!
      if (!this.isEnraged) {
        this.enrage();
      }
    }
    
    this.hpBar.fillStyle(color, 1);
    this.hpBar.fillRect(barX + 2, barY + 2, (barWidth - 4) * hpPercent, barHeight - 4);
    
    this.hpBar.setScrollFactor(0);
    this.hpBar.setDepth(999);
  }

  enrage() {
    this.isEnraged = true;
    this.moveSpeed = 45;
    this.chargeSpeed = 220;
    this.attackCooldown = 2000;
    this.setTint(0xff6666);
    
    // Avviso
    const rageText = this.scene.add.text(320, 70, '⚡ ENRAGED! ⚡', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ff4444',
      fontStyle: 'bold'
    });
    rageText.setOrigin(0.5);
    rageText.setScrollFactor(0);
    rageText.setDepth(1001);
    
    this.scene.tweens.add({
      targets: rageText,
      alpha: 0,
      y: 50,
      duration: 1500,
      onComplete: () => rageText.destroy()
    });
  }

  update(player) {
    if (!this.active || !player) return;
    
    // Se sta caricando, continua la carica
    if (this.isCharging) {
      this.body.setVelocity(
        this.chargeDirection.x * this.chargeSpeed,
        this.chargeDirection.y * this.chargeSpeed
      );
      return;
    }
    
    if (this.isAttacking) return;
    
    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    const now = this.scene.time.now;
    
    // Carica se il player è lontano
    if (distance > 100 && now - this.lastAttackTime > this.attackCooldown) {
      this.startCharge(player);
      return;
    }
    
    // Attacco normale se vicino
    if (distance < 50 && now - this.lastAttackTime > this.attackCooldown) {
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
      this.play("boss_orc_walk_anim");
      this.isMoving = true;
    } else if (!moving && this.isMoving) {
      this.play("boss_orc_idle_anim");
      this.isMoving = false;
    }
    
    this.updateHPBar();
  }

  startCharge(player) {
    this.isCharging = true;
    this.lastAttackTime = this.scene.time.now;
    
    // Calcola direzione della carica
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    this.chargeDirection = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    };
    
    this.flipX = this.chargeDirection.x < 0;
    this.play("boss_orc_run_anim");
    
    // Avviso visivo
    this.setTint(this.isEnraged ? 0xff0000 : 0xff8800);
    
    // Ferma la carica dopo un po'
    this.scene.time.delayedCall(800, () => {
      if (this.active) {
        this.isCharging = false;
        this.clearTint();
        if (this.isEnraged) this.setTint(0xff6666);
        this.play("boss_orc_idle_anim");
      }
    });
  }

  attack() {
    this.isAttacking = true;
    this.lastAttackTime = this.scene.time.now;
    this.body.setVelocity(0, 0);
    
    this.play("boss_orc_attack_anim");
    this.scene.cameras.main.shake(300, 0.015);
    
    this.once('animationcomplete', () => {
      this.isAttacking = false;
      this.play("boss_orc_idle_anim");
    });
  }

  takeDamage(dmg) {
    this.currentHP -= dmg;
    this.updateHPBar();
    
    this.setTint(0xffffff);
    this.scene.time.delayedCall(80, () => {
      if (this.active) {
        this.clearTint();
        if (this.isEnraged) this.setTint(0xff6666);
      }
    });
    
    this.scene.cameras.main.shake(30, 0.003);
    
    return this.currentHP <= 0;
  }

  die() {
    this.body.setVelocity(0, 0);
    this.clearTint();
    this.play("boss_orc_death_anim");
    
    // Screen shake EPICO
    this.scene.cameras.main.shake(800, 0.03);
    
    // Flash schermo
    this.scene.cameras.main.flash(500, 255, 200, 100);
    
    const victoryText = this.scene.add.text(320, 100, '👑 ORC WARLORD SCONFITTO! 👑', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#ffdd00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    });
    victoryText.setOrigin(0.5);
    victoryText.setScrollFactor(0);
    victoryText.setDepth(1000);
    
    this.scene.tweens.add({
      targets: victoryText,
      y: 70,
      alpha: 0,
      duration: 4000,
      onComplete: () => victoryText.destroy()
    });
    
    this.once('animationcomplete', () => {
      if (this.hpBar) this.hpBar.destroy();
      const index = this.scene.enemies.indexOf(this);
      if (index > -1) this.scene.enemies.splice(index, 1);
      
      if (this.scene.waveManager) {
        this.scene.waveManager.bossDefeated();
      }
      
      this.destroy();
    });
  }
}
