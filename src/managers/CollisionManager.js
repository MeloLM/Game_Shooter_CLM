/**
 * CollisionManager.js
 * Gestisce tutte le collisioni del gioco in modo centralizzato
 * Seguendo il pattern Event-Driven dell'architettura
 */
import { DeathAnim } from "../entities/effects/DeathAnim.js";
import { Thunder } from "../entities/weapons/Thunder.js";
import { Shield } from "../entities/weapons/Shield.js";
import { AchievementSystem } from "./AchievementSystem.js";
import { YellowBottle } from "../entities/items/YellowBottle.js";
import { RedBottle } from "../entities/items/RedBottle.js";
import { GreenBottle } from "../entities/items/GreenBottle.js";
import { BlueBottle } from "../entities/items/BlueBottle.js";
import { OrangeBottle } from "../entities/items/OrangeBottle.js";
import { CyanBottle } from "../entities/items/CyanBottle.js";
import { PurpleBottle } from "../entities/items/PurpleBottle.js";

export class CollisionManager {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Gestisce la collisione tra player e bottiglie (power-up)
   * @param {Player} player 
   * @param {Bottle} bottle 
   */
  handleBottleCollision(player, bottle) {
    let powerUpName = '';
    let powerUpColor = '#ffffff';

    if (bottle instanceof YellowBottle) {
      player.power = true;
      powerUpName = 'Laser';
      powerUpColor = '#ffa500';
    } else if (bottle instanceof RedBottle) {
      player.heal();
      powerUpName = 'Heal';
      powerUpColor = '#ff0000';
    } else if (bottle instanceof GreenBottle) {
      if (!player.hasSpeedBoost) {
        player.hasSpeedBoost = true;
        const speedBoost = 130;
        player.speed = player.baseSpeed + speedBoost;
        powerUpName = 'Speed';
        powerUpColor = '#00ff00';
        this.scene.time.delayedCall(5000, () => {
          player.speed = player.baseSpeed;
          player.hasSpeedBoost = false;
        });
      } else {
        powerUpName = 'Speed (già attivo)';
        powerUpColor = '#88ff88';
      }
    } else if (bottle instanceof BlueBottle) {
      if (!this.scene.immunity) {
        this.scene.immunity = true;
        this.scene.lastCollisionTime = this.scene.time.now;
        this.scene.shield = new Shield(this.scene, player.x, player.y, "shield1");
      }
      powerUpName = 'Shield';
      powerUpColor = '#0000ff';
    } else if (bottle instanceof OrangeBottle) {
      player.weaponType = 'shotgun';
      powerUpName = 'Shotgun';
      powerUpColor = '#ff8800';
      this.scene.time.delayedCall(10000, () => {
        if (player.weaponType === 'shotgun') {
          player.weaponType = 'normal';
        }
      });
    } else if (bottle instanceof CyanBottle) {
      player.weaponType = 'boomerang';
      powerUpName = 'Boomerang';
      powerUpColor = '#00ffff';
      this.scene.time.delayedCall(10000, () => {
        if (player.weaponType === 'boomerang') {
          player.weaponType = 'normal';
        }
      });
    } else if (bottle instanceof PurpleBottle) {
      this.scene.enemies.forEach((enemy) => {
        new Thunder(this.scene, enemy.x, enemy.y);
        enemy.die("thunder");
        this.scene.enemyCounter++;
        if (this.scene.waveManager) {
          this.scene.waveManager.onEnemyKilled();
        }
      });
      powerUpName = 'Thunder';
      powerUpColor = '#800080';
    }

    // Effetto particelle
    const colorMap = {
      '#ff0000': 0xff0000, '#ffa500': 0xffa500, '#00ff00': 0x00ff00,
      '#0000ff': 0x0000ff, '#800080': 0x800080, '#ffffff': 0xffffff
    };
    
    if (this.scene.hudManager) {
      this.scene.hudManager.showPickupEffect(bottle.x, bottle.y, colorMap[powerUpColor] || 0xffffff);
      this.scene.hudManager.showPowerUpText(player, powerUpName, powerUpColor);
    }

    // Incrementa contatore pozioni
    this.scene.potionsCollected++;
    
    // Distruggi bottiglia
    bottle.destroy();
    this.scene.bottles = this.scene.bottles.filter(b => b !== bottle);
  }

  /**
   * Gestisce la collisione tra player e nemici (danno)
   * @param {Player} player 
   * @param {Enemy} enemy 
   */
  handleEnemyCollision(player, enemy) {
    if (!this.scene.immunity) {
      player.takeDamage(enemy.enemyDmg);
      
      // Knockback
      const knockbackForce = 200;
      const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
      const knockbackX = Math.cos(angle) * knockbackForce;
      const knockbackY = Math.sin(angle) * knockbackForce;
      
      player.setVelocity(knockbackX, knockbackY);
      
      this.scene.time.delayedCall(150, () => {
        if (player.body) {
          player.setVelocity(0, 0);
        }
      });
      
      // Feedback visivi
      this.scene.cameras.main.shake(100, 0.01);
      
      if (this.scene.hudManager) {
        this.scene.hudManager.showDamageFlash();
      }
    }
    
    player.updateHPBar();
    
    // Check morte player
    if (player.currentHP <= 0) {
      this.handlePlayerDeath();
    }
  }

  /**
   * Gestisce la collisione tra attacchi e nemici
   * @param {Attack} attack 
   * @param {Enemy} enemy 
   */
  handleAttackEnemyCollision(attack, enemy) {
    const player = this.scene.player;
    const baseDamage = player.power ? 15 : 25;
    const attackDamage = player.getTotalDamage(baseDamage);
    const isDead = enemy.takeDamage(attackDamage);
    
    // Rimuovi attacco
    this.scene.attacks = this.scene.attacks.filter(a => a !== attack);
    attack.destroy();
    
    if (isDead) {
      this.handleEnemyDeath(enemy);
    }
  }

  /**
   * Gestisce la morte di un nemico
   * @param {Enemy} enemy 
   */
  handleEnemyDeath(enemy) {
    new DeathAnim(this.scene, enemy.x, enemy.y);
    
    // Track kills per achievement
    const enemyName = enemy.constructor.name;
    if (enemyName.includes('Slime')) {
      this.scene.slimeKills++;
    }
    
    // Effetti visivi
    if (this.scene.visualEffects) {
      let enemyType = 'default';
      if (enemyName.includes('Slime')) enemyType = 'slime';
      else if (enemyName === 'Goblin') enemyType = 'goblin';
      else if (enemyName === 'Fly') enemyType = 'fly';
      else if (enemyName === 'TankEnemy') enemyType = 'tank';
      else if (enemyName === 'SpeedEnemy') enemyType = 'speed';
      else if (enemyName === 'RangedEnemy') enemyType = 'ranged';
      
      this.scene.visualEffects.createDeathParticles(enemy.x, enemy.y, enemyType);
    }
    
    // XP reward
    const xpReward = enemy.xpReward || 10;
    this.scene.player.addXP(xpReward);
    
    // Combo system
    const comboMultiplier = this.scene.comboSystem ? this.scene.comboSystem.onKill() : 1;
    const scoreGain = Math.floor(10 * comboMultiplier);
    this.scene.totalScore += scoreGain;
    
    enemy.die();
    this.scene.enemyCounter++;
    
    // Notifica WaveManager
    if (this.scene.waveManager) {
      this.scene.waveManager.onEnemyKilled();
    }
    
    // Emit evento
    this.scene.events.emit('enemyKilled', { enemy, scoreGain });
  }

  /**
   * Gestisce la morte del player
   */
  handlePlayerDeath() {
    this.scene.survivalTime = (this.scene.time.now - this.scene.startTime) / 1000;
    
    if (this.scene.audioManager) {
      this.scene.audioManager.stopAllBGM();
    }
    
    this.scene.scene.start('GameOver', {
      score: this.scene.enemyCounter,
      time: this.scene.survivalTime
    });
  }

  /**
   * Setup di tutte le collisioni
   */
  setupCollisions() {
    // Collisione player-bottiglie
    this.scene.physics.collide(
      this.scene.player, 
      this.scene.bottles, 
      (player, bottle) => this.handleBottleCollision(player, bottle)
    );
    
    // Collisione player-nemici
    this.scene.physics.collide(
      this.scene.player, 
      this.scene.enemies, 
      (player, enemy) => this.handleEnemyCollision(player, enemy)
    );
    
    // Collisione attacchi-nemici
    this.scene.physics.collide(
      this.scene.attacks, 
      this.scene.enemies, 
      (attack, enemy) => this.handleAttackEnemyCollision(attack, enemy)
    );
  }
}
