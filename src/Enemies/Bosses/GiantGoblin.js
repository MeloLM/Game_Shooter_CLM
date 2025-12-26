import { Physics } from "phaser";

/**
 * GiantGoblin - Boss che appare alla wave 10, 30, 50...
 * Comportamento: Grande, lento, attacchi potenti
 * Stats: HP 500, DMG 50, lento ma devastante
 */
export class GiantGoblin extends Physics.Arcade.Sprite {
  maxHP = 500;
  currentHP = 500;
  enemyDmg = 50;
  moveSpeed = 25;
  xpReward = 200;
  hpBar;
  isBoss = true;
  bossName = "Giant Goblin";
  
  // Stato attacco
  attackCooldown = 2000;
  lastAttackTime = 0;
  isAttacking = false;
  chargeSpeed = 120;

  constructor(scene, x, y) {
    super(scene, x, y, "boss_goblin_idle");

    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Boss è più grande
    this.setScale(1.5);
    this.body.setSize(40, 50);

    this.hpBar = scene.add.graphics();
    this.updateHPBar();

    // Animazione idle
    if (!scene.anims.exists("boss_goblin_idle_anim")) {
      scene.anims.create({
        key: "boss_goblin_idle_anim",
        repeat: -1,
        frameRate: 6,
        frames: scene.anims.generateFrameNumbers("boss_goblin_idle", {
          start: 0,
          end: 5,
        })
      });
    }

    // Animazione walk
    if (!scene.anims.exists("boss_goblin_walk_anim")) {
      scene.anims.create({
        key: "boss_goblin_walk_anim",
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNumbers("boss_goblin_walk", {
          start: 0,
          end: 5,
        })
      });
    }

    // Animazione attacco
    if (!scene.anims.exists("boss_goblin_attack_anim")) {
      scene.anims.create({
        key: "boss_goblin_attack_anim",
        repeat: 0,
        frameRate: 10,
        frames: scene.anims.generateFrameNumbers("boss_goblin_attack", {
          start: 0,
          end: 5,
        })
      });
    }

    // Animazione morte
    if (!scene.anims.exists("boss_goblin_death_anim")) {
      scene.anims.create({
        key: "boss_goblin_death_anim",
        repeat: 0,
        frameRate: 8,
        frames: scene.anims.generateFrameNumbers("boss_goblin_death", {
          start: 0,
          end: 5,
        })
      });
    }

    this.play("boss_goblin_idle_anim");
    this.isMoving = false;
    
    // Annuncia il boss!
    this.showBossIntro(scene);
  }

  showBossIntro(scene) {
    // Testo di avviso boss
    const bossText = scene.add.text(320, 50, '⚠️ BOSS: GIANT GOBLIN ⚠️', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ff4444',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    });
    bossText.setOrigin(0.5);
    bossText.setScrollFactor(0);
    bossText.setDepth(1000);
    
    // Animazione lampeggiante
    scene.tweens.add({
      targets: bossText,
      alpha: 0.3,
      duration: 300,
      yoyo: true,
      repeat: 5,
      onComplete: () => bossText.destroy()
    });
  }

  updateHPBar() {
    if (!this.hpBar || !this.active) return;
    this.hpBar.clear();
    
    // Boss ha una barra HP grande in alto allo schermo
    const barWidth = 200;
    const barHeight = 12;
    const barX = 220;
    const barY = 15;
    
    // Sfondo
    this.hpBar.fillStyle(0x333333, 1);
    this.hpBar.fillRect(barX, barY, barWidth, barHeight);
    
    // Bordo
    this.hpBar.lineStyle(2, 0xffffff, 1);
    this.hpBar.strokeRect(barX, barY, barWidth, barHeight);
    
    // HP
    const hpPercent = this.currentHP / this.maxHP;
    let color = 0xff4444; // Boss rosso
    if (hpPercent < 0.3) color = 0x880000;
    
    this.hpBar.fillStyle(color, 1);
    this.hpBar.fillRect(barX + 2, barY + 2, (barWidth - 4) * hpPercent, barHeight - 4);
    
    this.hpBar.setScrollFactor(0);
    this.hpBar.setDepth(999);
  }

  update(player) {
    if (!this.active || !player || this.isAttacking) return;
    
    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    const now = this.scene.time.now;
    
    // Se vicino al player, attacca
    if (distance < 60 && now - this.lastAttackTime > this.attackCooldown) {
      this.attack(player);
      return;
    }
    
    // Altrimenti muoviti verso il player
    this.body.setVelocity(
      Math.cos(angle) * this.moveSpeed,
      Math.sin(angle) * this.moveSpeed
    );
    
    this.flipX = this.body.velocity.x < 0;
    
    const moving = Math.abs(this.body.velocity.x) > 5 || Math.abs(this.body.velocity.y) > 5;
    if (moving && !this.isMoving) {
      this.play("boss_goblin_walk_anim");
      this.isMoving = true;
    } else if (!moving && this.isMoving) {
      this.play("boss_goblin_idle_anim");
      this.isMoving = false;
    }
    
    this.updateHPBar();
  }

  attack(player) {
    this.isAttacking = true;
    this.lastAttackTime = this.scene.time.now;
    this.body.setVelocity(0, 0);
    
    this.play("boss_goblin_attack_anim");
    
    // Screen shake durante l'attacco
    this.scene.cameras.main.shake(200, 0.01);
    
    this.once('animationcomplete', () => {
      this.isAttacking = false;
      this.play("boss_goblin_idle_anim");
    });
  }

  takeDamage(dmg) {
    this.currentHP -= dmg;
    this.updateHPBar();
    
    // Flash rosso per il boss
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      if (this.active) this.clearTint();
    });
    
    // Screen shake quando colpito
    this.scene.cameras.main.shake(50, 0.005);
    
    return this.currentHP <= 0;
  }

  die() {
    this.body.setVelocity(0, 0);
    this.play("boss_goblin_death_anim");
    
    // Screen shake epico
    this.scene.cameras.main.shake(500, 0.02);
    
    // Testo vittoria
    const victoryText = this.scene.add.text(320, 100, '🏆 BOSS SCONFITTO! 🏆', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffdd44',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    });
    victoryText.setOrigin(0.5);
    victoryText.setScrollFactor(0);
    victoryText.setDepth(1000);
    
    this.scene.tweens.add({
      targets: victoryText,
      y: 80,
      alpha: 0,
      duration: 3000,
      onComplete: () => victoryText.destroy()
    });
    
    this.once('animationcomplete', () => {
      if (this.hpBar) this.hpBar.destroy();
      const index = this.scene.enemies.indexOf(this);
      if (index > -1) this.scene.enemies.splice(index, 1);
      
      // Segnala al WaveManager che il boss è morto
      if (this.scene.waveManager) {
        this.scene.waveManager.bossDefeated();
      }
      
      this.destroy();
    });
  }
}
