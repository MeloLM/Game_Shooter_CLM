import { Physics } from "phaser";

/**
 * Classe base per tutti i nemici del gioco.
 * Contiene la logica comune per HP, barra vita, danno e morte.
 */
export class Enemy extends Physics.Arcade.Sprite {
  // Proprietà base (da sovrascrivere nelle sottoclassi)
  maxHP = 50;
  currentHP = 50;
  enemyDmg = 20;
  moveSpeed = 40;
  xpReward = 10;
  hpBar;
  animationKey;
  
  constructor(scene, x, y, texture, config = {}) {
    super(scene, x, y, texture);
    
    // Applica configurazione custom
    this.maxHP = config.maxHP || this.maxHP;
    this.currentHP = config.currentHP || this.maxHP;
    this.enemyDmg = config.enemyDmg || this.enemyDmg;
    this.moveSpeed = config.moveSpeed || this.moveSpeed;
    this.xpReward = config.xpReward || this.xpReward;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Barra HP del nemico
    this.hpBar = scene.add.graphics();
    this.updateHPBar();
  }
  
  /**
   * Crea l'animazione per il nemico (da chiamare nel costruttore delle sottoclassi)
   */
  createAnimation(scene, key, texture, startFrame, endFrame, frameRate = 6) {
    this.animationKey = key;
    if (!scene.anims.exists(key)) {
      scene.anims.create({
        key: key,
        repeat: -1,
        frameRate: frameRate,
        frames: scene.anims.generateFrameNumbers(texture, {
          start: startFrame,
          end: endFrame,
        })
      });
    }
    this.play(key);
  }
  
  /**
   * Aggiorna la barra HP sopra il nemico
   */
  updateHPBar() {
    if (!this.hpBar || !this.active) return;
    this.hpBar.clear();
    
    // Sfondo grigio
    this.hpBar.fillStyle(0x808080, 1);
    const barWidth = 12;
    const barHeight = 2;
    this.hpBar.fillRect(this.x - barWidth / 2, this.y - 10, barWidth, barHeight);
    
    // Barra HP (colore in base alla percentuale)
    const hpPercent = this.currentHP / this.maxHP;
    let color = 0x00ff00; // Verde
    if (hpPercent < 0.3) color = 0xff0000; // Rosso
    else if (hpPercent < 0.6) color = 0xffff00; // Giallo
    
    this.hpBar.fillStyle(color, 1);
    const hpWidth = barWidth * hpPercent;
    this.hpBar.fillRect(this.x - barWidth / 2, this.y - 10, hpWidth, barHeight);
  }
  
  /**
   * Infliggi danno al nemico
   * @returns {boolean} true se il nemico è morto
   */
  takeDamage(dmg) {
    this.currentHP -= dmg;
    this.updateHPBar();
    
    // Flash bianco quando colpito
    this.setTint(0xffffff);
    this.scene.time.delayedCall(100, () => {
      if (this.active) this.clearTint();
    });
    
    if (this.currentHP <= 0) {
      return true; // Nemico morto
    }
    return false;
  }
  
  /**
   * Logica di morte del nemico
   * NOTA: XP viene già data in Level.js, non duplicare qui
   */
  die(cause = "attack") {
    if (this.hpBar) {
      this.hpBar.destroy();
    }
    
    // Rimuovi dall'array enemies
    const index = this.scene.enemies.indexOf(this);
    if (index > -1) {
      this.scene.enemies.splice(index, 1);
    }
    
    // XP già gestita in Level.js (player.addXP chiamato là)
    // Non chiamare qui per evitare XP doppia
    
    this.destroy();
  }
  
  /**
   * Movimento verso il player (comportamento base)
   */
  moveTowardsPlayer() {
    if (!this.scene || !this.scene.player) return;
    
    this.scene.physics.moveToObject(this, this.scene.player, this.moveSpeed);
    
    // Flip sprite in base alla direzione
    if (this.x > this.scene.player.x) {
      this.setFlipX(true);
    } else {
      this.setFlipX(false);
    }
  }
  
  /**
   * Update chiamato ogni frame (da sovrascrivere per comportamenti custom)
   */
  update() {
    this.moveTowardsPlayer();
    this.updateHPBar();
  }
}
