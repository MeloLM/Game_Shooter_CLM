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
    this.coinText = null;
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
    // --- TOP BAR BACKGROUND ---
    this.hudBg = this.scene.add.rectangle(320, 15, 640, 30, 0x000000, 0.8);
    this.hudBg.setScrollFactor(0);
    this.hudBg.setDepth(hudDepth);

    // --- LEFT SECTION (HEALTH) ---
    // Heart Icon (Emoji placeholder or sprite if available)
    this.hpIcon = this.scene.add.text(20, 15, '❤', { fontSize: '16px', color: '#ff0000' }).setOrigin(0.5);
    this.hpIcon.setScrollFactor(0).setDepth(hudDepth + 1);

    this.hpText = this.scene.add.text(40, 15, '1000/1000', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5);
    this.hpText.setScrollFactor(0).setDepth(hudDepth + 1);

    // --- CENTER SECTION (GAME INFO) ---
    // Wave
    this.waveText = this.scene.add.text(240, 15, '🌊 W1', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#00ffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.waveText.setScrollFactor(0).setDepth(hudDepth + 1);

    // Timer
    this.timerText = this.scene.add.text(320, 15, '0:00', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.timerText.setScrollFactor(0).setDepth(hudDepth + 1);

    // Score/Kills
    this.scoreText = this.scene.add.text(400, 15, '💀 0', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#aaaaaa'
    }).setOrigin(0.5);
    this.scoreText.setScrollFactor(0).setDepth(hudDepth + 1);

    // --- RIGHT SECTION (ECONOMY & WEAPON) ---
    // Coin
    this.coinIcon = this.scene.add.text(500, 15, '💰', { fontSize: '14px' }).setOrigin(0.5);
    this.coinIcon.setScrollFactor(0).setDepth(hudDepth + 1);

    this.coinText = this.scene.add.text(520, 15, '0', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffd700',
      fontStyle: 'bold'
    }).setOrigin(0, 0.5);
    this.coinText.setScrollFactor(0).setDepth(hudDepth + 1);

    // Weapon
    this.weaponText = this.scene.add.text(620, 15, '⚔️', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(1, 0.5);
    this.weaponText.setScrollFactor(0).setDepth(hudDepth + 1);

    // --- HP BAR (BOTTOM COMPACT) ---
    this.hpBarBg = this.scene.add.rectangle(320, 355, 640, 6, 0x111111, 0.8);
    this.hpBarBg.setScrollFactor(0).setDepth(hudDepth);

    this.hpBarFill = this.scene.add.rectangle(0, 355, 640, 6, 0xff0000);
    this.hpBarFill.setOrigin(0, 0.5); // Start directly from left
    this.hpBarFill.setScrollFactor(0).setDepth(hudDepth + 1);

    // Damage flash overlay
    this.damageFlash = this.scene.add.rectangle(320, 180, 640, 360, 0xff0000, 0);
    this.damageFlash.setScrollFactor(0);
    this.damageFlash.setDepth(hudDepth + 5);
  }

  /**
   * Aggiorna l'HUD ogni frame
   * @param {Object} data - dati per l'aggiornamento { enemyCounter, startTime, player }
   */
  update(data) {
    const { enemyCounter, startTime, player } = data;

    // Aggiorna score
    this.scoreText.setText('💀 ' + enemyCounter);

    // Aggiorna coins
    if (this.scene.shopSystem) {
      this.coinText.setText(`${this.scene.shopSystem.coins}`);
    }

    // Aggiorna timer
    const elapsed = (this.scene.time.now - startTime) / 1000;
    const minutes = Math.floor(elapsed / 60);
    const seconds = Math.floor(elapsed % 60);
    this.timerText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);

    // Aggiorna wave (se disponibile)
    if (this.scene.waveManager) {
      this.waveText.setText(`🌊 W${this.scene.waveManager.currentWave}`);
    }

    // Aggiorna arma
    if (player) {
      let weaponIcon = '⚔️';
      let weaponColor = '#ffffff';

      if (player.weaponType === 'shotgun') {
        weaponIcon = '🔥';
        weaponColor = '#ff8800';
      } else if (player.weaponType === 'boomerang') {
        weaponIcon = '🪃';
        weaponColor = '#00ffff';
      } else if (player.power) {
        weaponIcon = '🔫';
        weaponColor = '#ffff00';
      }

      this.weaponText.setText(weaponIcon);
      this.weaponText.setColor(weaponColor);
    }

    // Aggiorna HP bar (full width bottom)
    if (player) {
      const hpPercent = player.currentHP / player.maxHP;
      this.hpBarFill.setScale(hpPercent, 1);
      this.hpText.setText(`${Math.floor(player.currentHP)}/${player.maxHP}`);

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
