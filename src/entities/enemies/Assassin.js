import { Enemy } from "./Enemy.js";

/**
 * Assassin - Nemico che diventa invisibile
 * - Si rende invisibile periodicamente
 * - Quando invisibile è più veloce ma non può attaccare
 * - Quando visibile rallenta ma può attaccare
 * - Appare brevemente prima di attaccare
 */
export class Assassin extends Enemy {
  // Stats
  maxHP = 60;
  currentHP = 60;
  enemyDmg = 35;
  moveSpeed = 60;
  xpReward = 25;
  
  // Stealth system
  isInvisible = false;
  stealthDuration = 2000;      // Durata invisibilità
  visibleDuration = 1500;      // Durata visibilità
  attackWarningTime = 300;     // Tempo di avviso prima dell'attacco
  stealthTimer = null;
  
  // Velocità
  normalSpeed = 60;
  stealthSpeed = 100;          // Più veloce quando invisibile
  
  // Stato
  isWarning = false;           // Sta per attaccare
  lastStateChange = 0;
  
  constructor(scene, x, y) {
    super(scene, x, y, "assassin_sprite", {
      maxHP: 60,
      currentHP: 60,
      enemyDmg: 35,
      moveSpeed: 60,
      xpReward: 25
    });
    
    this.normalSpeed = this.moveSpeed;
    this.stealthSpeed = this.moveSpeed * 1.7;
    
    // Setup animazioni
    this.setupAnimations(scene);
    
    // Inizia in modalità visibile
    this.setVisible(true);
    this.setAlpha(1);
    
    // Timer per cambio stato
    this.lastStateChange = scene.time.now;
    
    // Inizia ciclo stealth dopo un delay
    scene.time.delayedCall(1000, () => {
      this.startStealthCycle();
    });
  }
  
  /**
   * Setup animazioni assassin
   * Usa sprite esistente o placeholder
   */
  setupAnimations(scene) {
    // Prova a usare sprite skeleton se disponibile
    const textureKey = scene.textures.exists('skeleton_knight_1_run') 
      ? 'skeleton_knight_1_run' 
      : 'slime_green_walk';
    
    this.setTexture(textureKey);
    
    const animKey = 'assassin_walk';
    if (!scene.anims.exists(animKey)) {
      scene.anims.create({
        key: animKey,
        repeat: -1,
        frameRate: 8,
        frames: scene.anims.generateFrameNumbers(textureKey, {
          start: 0,
          end: scene.textures.exists('skeleton_knight_1_run') ? 7 : 3
        })
      });
    }
    
    this.play(animKey);
    
    // Tint viola per distinguerlo
    this.setTint(0x9932CC);
  }
  
  /**
   * Inizia il ciclo di stealth
   */
  startStealthCycle() {
    if (!this.active || !this.scene) return;
    
    // Entra in stealth
    this.enterStealth();
  }
  
  /**
   * Entra in modalità stealth (invisibile)
   */
  enterStealth() {
    if (!this.active) return;
    
    this.isInvisible = true;
    this.isWarning = false;
    this.moveSpeed = this.stealthSpeed;
    
    // Fade out
    this.scene.tweens.add({
      targets: this,
      alpha: 0.15, // Quasi invisibile ma non del tutto (per fairness)
      duration: 300,
      ease: 'Power2'
    });
    
    // Nascondi HP bar quando invisibile
    if (this.hpBar) {
      this.hpBar.setAlpha(0.15);
    }
    
    // Timer per tornare visibile
    this.scene.time.delayedCall(this.stealthDuration, () => {
      if (this.active) {
        this.exitStealth();
      }
    });
  }
  
  /**
   * Esce dalla modalità stealth (diventa visibile)
   */
  exitStealth() {
    if (!this.active) return;
    
    this.isWarning = true;
    
    // Flash di avviso prima di diventare completamente visibile
    this.setTint(0xff0000); // Tint rosso = pericolo
    this.scene.tweens.add({
      targets: this,
      alpha: 0.6,
      duration: 100,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        if (this.active) {
          this.becomeFullyVisible();
        }
      }
    });
  }
  
  /**
   * Diventa completamente visibile e attaccabile
   */
  becomeFullyVisible() {
    if (!this.active) return;
    
    this.isInvisible = false;
    this.isWarning = false;
    this.moveSpeed = this.normalSpeed;
    
    // Torna al colore originale
    this.setTint(0x9932CC);
    
    // Fade in completo
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 200
    });
    
    // Mostra HP bar
    if (this.hpBar) {
      this.hpBar.setAlpha(1);
    }
    
    // Timer per tornare in stealth
    this.scene.time.delayedCall(this.visibleDuration, () => {
      if (this.active) {
        this.enterStealth();
      }
    });
  }
  
  /**
   * Override takeDamage - danno ridotto quando invisibile
   */
  takeDamage(dmg) {
    // Danno dimezzato quando invisibile
    const actualDamage = this.isInvisible ? Math.floor(dmg * 0.5) : dmg;
    
    // Se colpito mentre invisibile, diventa visibile
    if (this.isInvisible) {
      this.forceVisible();
    }
    
    // Flash bianco
    this.setTint(0xffffff);
    this.scene.time.delayedCall(100, () => {
      if (this.active) {
        this.setTint(0x9932CC);
      }
    });
    
    return super.takeDamage(actualDamage);
  }
  
  /**
   * Forza visibilità quando colpito
   */
  forceVisible() {
    this.isInvisible = false;
    this.moveSpeed = this.normalSpeed;
    this.setAlpha(1);
    
    if (this.hpBar) {
      this.hpBar.setAlpha(1);
    }
    
    // Stunned brevemente
    this.moveSpeed = this.normalSpeed * 0.5;
    this.scene.time.delayedCall(500, () => {
      if (this.active) {
        this.moveSpeed = this.normalSpeed;
        // Riprendi ciclo stealth
        this.scene.time.delayedCall(this.visibleDuration, () => {
          if (this.active) this.enterStealth();
        });
      }
    });
  }
  
  /**
   * Override update
   */
  update(player) {
    if (!this.active || !player) return;
    
    // Movimento verso il player
    this.scene.physics.moveToObject(this, player, this.moveSpeed);
    
    // Flip sprite
    this.setFlipX(this.x > player.x);
    
    // Update HP bar
    if (this.hpBar && this.alpha > 0.3) {
      this.updateHPBar();
    }
  }
  
  /**
   * Override die
   */
  die(cause = "attack") {
    // Effetto morte speciale - svanisce
    if (this.scene && this.scene.visualEffects) {
      // Particelle viola
      for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2;
        const particle = this.scene.add.circle(this.x, this.y, 3, 0x9932CC);
        particle.setDepth(10);
        
        this.scene.tweens.add({
          targets: particle,
          x: this.x + Math.cos(angle) * 25,
          y: this.y + Math.sin(angle) * 25,
          alpha: 0,
          duration: 400,
          onComplete: () => particle.destroy()
        });
      }
    }
    
    super.die(cause);
  }
}
