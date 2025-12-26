import { Enemy } from "./Enemy.js";
import { Physics } from "phaser";

/**
 * Ranged Enemy - Nemico che spara proiettili
 * Mantiene le distanze e attacca da lontano
 */
export class RangedEnemy extends Enemy {
  lastShootTime = 0;
  shootCooldown = 2000; // 2 secondi tra un colpo e l'altro
  preferredDistance = 100; // Distanza ideale dal player
  projectiles = [];
  
  constructor(scene, x, y, texture = "goblin") {
    super(scene, x, y, texture, {
      maxHP: 35,
      enemyDmg: 15, // Danno a contatto
      moveSpeed: 30,
      xpReward: 25
    });
    
    this.setTint(0x9932CC); // Viola
    this.setScale(0.9);
    
    this.createAnimation(scene, "ranged_run", texture, 0, 5, 5);
  }
  
  moveTowardsPlayer() {
    if (!this.scene || !this.scene.player) return;
    
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      this.scene.player.x, this.scene.player.y
    );
    
    // Se troppo vicino, allontanati
    if (distance < this.preferredDistance - 20) {
      const angle = Phaser.Math.Angle.Between(
        this.scene.player.x, this.scene.player.y,
        this.x, this.y
      );
      this.setVelocity(
        Math.cos(angle) * this.moveSpeed,
        Math.sin(angle) * this.moveSpeed
      );
    }
    // Se troppo lontano, avvicinati
    else if (distance > this.preferredDistance + 20) {
      this.scene.physics.moveToObject(this, this.scene.player, this.moveSpeed);
    }
    // Distanza giusta, fermati e spara
    else {
      this.setVelocity(0, 0);
      this.tryShoot();
    }
    
    // Flip verso il player
    if (this.x > this.scene.player.x) {
      this.setFlipX(true);
    } else {
      this.setFlipX(false);
    }
  }
  
  tryShoot() {
    const now = this.scene.time.now;
    if (now - this.lastShootTime >= this.shootCooldown) {
      this.lastShootTime = now;
      this.shoot();
    }
  }
  
  shoot() {
    if (!this.scene || !this.scene.player) return;
    
    const angle = Phaser.Math.Angle.Between(
      this.x, this.y,
      this.scene.player.x, this.scene.player.y
    );
    
    // Crea proiettile nemico
    const projectile = new EnemyProjectile(this.scene, this.x, this.y, angle);
    this.projectiles.push(projectile);
    
    // Aggiungi collider con il player
    this.scene.physics.add.overlap(projectile, this.scene.player, (proj, player) => {
      if (!this.scene.immunity) {
        player.takeDamage(20);
        player.updateHPBar();
        
        // Feedback visivo
        this.scene.cameras.main.shake(80, 0.008);
        if (this.scene.showDamageFlash) {
          this.scene.showDamageFlash();
        }
        
        // Check morte player
        if (player.currentHP <= 0) {
          this.scene.survivalTime = (this.scene.time.now - this.scene.startTime) / 1000;
          this.scene.scene.start('GameOver', {
            score: this.scene.enemyCounter,
            time: this.scene.survivalTime
          });
        }
      }
      proj.destroy();
    });
  }
  
  die(cause = "attack") {
    // Distruggi tutti i proiettili
    this.projectiles.forEach(p => {
      if (p && p.active) p.destroy();
    });
    super.die(cause);
  }
}

/**
 * Proiettile sparato dal RangedEnemy
 */
class EnemyProjectile extends Physics.Arcade.Sprite {
  speed = 120;
  lifetime = 3000;
  
  constructor(scene, x, y, angle) {
    // Usa texture della sword ma con tinta diversa
    super(scene, x, y, "sword");
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setScale(0.8);
    this.setTint(0x9932CC); // Viola
    this.setRotation(angle);
    
    // Imposta velocità
    this.setVelocity(
      Math.cos(angle) * this.speed,
      Math.sin(angle) * this.speed
    );
    
    // Auto-distruzione dopo un po'
    scene.time.delayedCall(this.lifetime, () => {
      if (this.active) this.destroy();
    });
  }
}
