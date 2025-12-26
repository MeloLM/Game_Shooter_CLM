/**
 * HUDManager.js
 * Gestisce tutta l'interfaccia utente in-game (HUD)
 * Seguendo il pattern Event-Driven: ascolta eventi e aggiorna la UI
 */
export class HUDManager {
  constructor(scene) {
    this.scene = scene;
    
    // Elementi HUD
    this.hudBg = null;
    this.scoreText = null;
    this.timerText = null;
    this.weaponText = null;
    this.hpBarBg = null;
    this.hpBarFill = null;
    this.hpText = null;
    this.damageFlash = null;
  }

  /**
   * Crea tutti gli elementi HUD
   * @param {number} hudDepth - profondità z per l'HUD
   */
  create(hudDepth) {
    // Sfondo HUD in alto
    this.hudBg = this.scene.add.rectangle(320, 12, 640, 24, 0x000000, 0.5);
    this.hudBg.setScrollFactor(0);
    this.hudBg.setDepth(hudDepth);

    // Score (sinistra)
    this.scoreText = this.scene.add.text(10, 5, '💀 0', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff'
    });
    this.scoreText.setScrollFactor(0);
    this.scoreText.setDepth(hudDepth + 1);

    // Timer (centro)
    this.timerText = this.scene.add.text(320, 5, '⏱️ 0:00', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff'
    });
    this.timerText.setOrigin(0.5, 0);
    this.timerText.setScrollFactor(0);
    this.timerText.setDepth(hudDepth + 1);

    // Arma corrente (destra)
    this.weaponText = this.scene.add.text(630, 5, '⚔️ Spada', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff'
    });
    this.weaponText.setOrigin(1, 0);
    this.weaponText.setScrollFactor(0);
    this.weaponText.setDepth(hudDepth + 1);

    // HP Bar grande in basso
    this.hpBarBg = this.scene.add.rectangle(320, 350, 200, 8, 0x333333);
    this.hpBarBg.setScrollFactor(0);
    this.hpBarBg.setDepth(hudDepth);

    this.hpBarFill = this.scene.add.rectangle(221, 350, 198, 6, 0xff0000);
    this.hpBarFill.setOrigin(0, 0.5);
    this.hpBarFill.setScrollFactor(0);
    this.hpBarFill.setDepth(hudDepth + 1);

    this.hpText = this.scene.add.text(320, 340, '1000/1000', {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: '#ffffff'
    });
    this.hpText.setOrigin(0.5);
    this.hpText.setScrollFactor(0);
    this.hpText.setDepth(hudDepth + 2);

    // Damage flash overlay
    this.damageFlash = this.scene.add.rectangle(320, 180, 640, 360, 0xff0000, 0);
    this.damageFlash.setScrollFactor(0);
    this.damageFlash.setDepth(99);
  }

  /**
   * Aggiorna l'HUD ogni frame
   * @param {Object} data - dati per l'aggiornamento { enemyCounter, startTime, player }
   */
  update(data) {
    const { enemyCounter, startTime, player } = data;

    // Aggiorna score
    this.scoreText.setText('💀 ' + enemyCounter);

    // Aggiorna timer
    const elapsed = (this.scene.time.now - startTime) / 1000;
    const minutes = Math.floor(elapsed / 60);
    const seconds = Math.floor(elapsed % 60);
    this.timerText.setText(`⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`);

    // Aggiorna arma
    if (player) {
      let weaponName = '⚔️ Spada';
      let weaponColor = '#ffffff';
      
      if (player.weaponType === 'shotgun') {
        weaponName = '🔥 Shotgun';
        weaponColor = '#ff8800';
      } else if (player.weaponType === 'boomerang') {
        weaponName = '🪃 Boomerang';
        weaponColor = '#00ffff';
      } else if (player.power) {
        weaponName = '🔫 Laser';
        weaponColor = '#ffff00';
      }
      
      this.weaponText.setText(weaponName);
      this.weaponText.setColor(weaponColor);
    }

    // Aggiorna HP bar
    if (player) {
      const hpPercent = player.currentHP / player.maxHP;
      this.hpBarFill.setScale(hpPercent, 1);
      this.hpText.setText(`${player.currentHP}/${player.maxHP}`);
      
      // Cambia colore in base agli HP
      if (hpPercent > 0.6) {
        this.hpBarFill.setFillStyle(0x00ff00); // Verde
      } else if (hpPercent > 0.3) {
        this.hpBarFill.setFillStyle(0xffff00); // Giallo
      } else {
        this.hpBarFill.setFillStyle(0xff0000); // Rosso
      }
    }
  }

  /**
   * Mostra flash rosso quando si prende danno
   */
  showDamageFlash() {
    if (!this.damageFlash) return;
    
    this.scene.tweens.add({
      targets: this.damageFlash,
      alpha: { from: 0.4, to: 0 },
      duration: 150,
      ease: 'Power2'
    });
  }

  /**
   * Effetto particelle quando si raccoglie una pozione
   * @param {number} x - posizione X
   * @param {number} y - posizione Y
   * @param {number} color - colore hex
   */
  showPickupEffect(x, y, color) {
    for (let i = 0; i < 8; i++) {
      const particle = this.scene.add.circle(x, y, 3, color);
      const angle = (i / 8) * Math.PI * 2;
      const distance = 20;
      
      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0,
        duration: 300,
        onComplete: () => particle.destroy()
      });
    }
  }

  /**
   * Mostra testo power-up temporaneo
   * @param {Object} player - riferimento al player
   * @param {string} powerUpName - nome del power-up
   * @param {string} powerUpColor - colore CSS
   */
  showPowerUpText(player, powerUpName, powerUpColor) {
    const powerUpText = this.scene.add.text(player.x, player.y - 50, powerUpName, {
      fontSize: '10px',
      fill: powerUpColor
    });
    powerUpText.setOrigin(0.5, 0.5);

    const textUpdate = this.scene.time.addEvent({
      delay: 16,
      callback: () => {
        powerUpText.setPosition(player.x, player.y - 20);
      },
      loop: true
    });
    
    this.scene.time.delayedCall(1000, () => {
      powerUpText.destroy();
      textUpdate.remove(false);
    });
  }

  /**
   * Getter per retrocompatibilità con Level.js
   */
  getScoreText() {
    return this.scoreText;
  }
}
