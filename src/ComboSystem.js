/**
 * Sistema Combo - Gestisce le uccisioni consecutive per moltiplicare i punti
 *
 * - Combo aumenta per ogni uccisione entro il timeout
 * - Moltiplicatore aumenta con il combo
 * - Combo si resetta dopo un periodo senza uccisioni
 */
export class ComboSystem {
  scene;
  currentCombo = 0;
  maxCombo = 0;
  comboTimeout = 3000; // 3 secondi per mantenere il combo
  lastKillTime = 0;
  comboText;
  multiplierText;
  comboTimer;

  // Moltiplicatori per livello combo
  multiplierLevels = [
    { combo: 0, multiplier: 1, color: '#ffffff' },
    { combo: 3, multiplier: 1.5, color: '#ffff00' },
    { combo: 5, multiplier: 2, color: '#ff8800' },
    { combo: 10, multiplier: 2.5, color: '#ff4400' },
    { combo: 15, multiplier: 3, color: '#ff0000' },
    { combo: 25, multiplier: 4, color: '#ff00ff' },
    { combo: 50, multiplier: 5, color: '#00ffff' },
  ];

  constructor(scene) {
    this.scene = scene;
    this.createComboUI();
  }

  /**
   * Crea l'UI per il combo
   */
  createComboUI() {
    // Testo combo (sotto la difficoltà, a sinistra)
    this.comboText = this.scene.add.text(10, 62, '', {
      fontFamily: 'Arial',
      fontSize: '11px',
      color: '#ffcc00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    });
    this.comboText.setOrigin(0, 0);
    this.comboText.setScrollFactor(0);
    this.comboText.setDepth(50);
    this.comboText.setAlpha(0);

    // Testo moltiplicatore
    this.multiplierText = this.scene.add.text(10, 75, '', {
      fontFamily: 'Arial',
      fontSize: '8px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1
    });
    this.multiplierText.setOrigin(0, 0);
    this.multiplierText.setScrollFactor(0);
    this.multiplierText.setDepth(50);
    this.multiplierText.setAlpha(0);

    // Barra timer combo
    this.comboTimerBar = this.scene.add.rectangle(50, 86, 60, 3, 0xffcc00);
    this.comboTimerBar.setOrigin(0.5, 0.5);
    this.comboTimerBar.setScrollFactor(0);
    this.comboTimerBar.setDepth(50);
    this.comboTimerBar.setAlpha(0);
  }

  /**
   * Chiamato quando un nemico viene ucciso
   * @returns {number} Punti bonus del combo
   */
  onKill() {
    const now = this.scene.time.now;

    // Incrementa combo
    this.currentCombo++;
    this.lastKillTime = now;

    // Aggiorna max combo
    if (this.currentCombo > this.maxCombo) {
      this.maxCombo = this.currentCombo;
    }

    // Resetta/avvia timer
    this.startComboTimer();

    // Aggiorna UI
    this.updateComboUI();

    // Mostra effetto
    this.showComboEffect();

    // Ritorna i punti bonus
    return this.getMultiplier();
  }

  /**
   * Ottieni il moltiplicatore corrente
   */
  getMultiplier() {
    let multiplier = 1;
    for (const level of this.multiplierLevels) {
      if (this.currentCombo >= level.combo) {
        multiplier = level.multiplier;
      }
    }
    return multiplier;
  }

  /**
   * Ottieni il colore corrente del combo
   */
  getComboColor() {
    let color = '#ffffff';
    for (const level of this.multiplierLevels) {
      if (this.currentCombo >= level.combo) {
        color = level.color;
      }
    }
    return color;
  }

  /**
   * Avvia/resetta il timer del combo
   */
  startComboTimer() {
    // Cancella timer precedente
    if (this.comboTimer) {
      this.comboTimer.remove();
    }

    // Nuovo timer
    this.comboTimer = this.scene.time.delayedCall(this.comboTimeout, () => {
      this.resetCombo();
    });

    // Anima la barra del timer
    this.comboTimerBar.setScale(1, 1);
    this.scene.tweens.add({
      targets: this.comboTimerBar,
      scaleX: 0,
      duration: this.comboTimeout,
      ease: 'Linear'
    });
  }

  /**
   * Resetta il combo
   */
  resetCombo() {
    if (this.currentCombo > 0) {
      // Mostra messaggio fine combo
      this.showComboEndMessage();
    }

    this.currentCombo = 0;

    // Nascondi UI
    this.scene.tweens.add({
      targets: [this.comboText, this.multiplierText, this.comboTimerBar],
      alpha: 0,
      duration: 300
    });
  }

  /**
   * Aggiorna l'UI del combo
   */
  updateComboUI() {
    if (this.currentCombo >= 2) {
      const color = this.getComboColor();
      const multiplier = this.getMultiplier();

      this.comboText.setText(`🔥 ${this.currentCombo} COMBO`);
      this.comboText.setColor(color);

      this.multiplierText.setText(`x${multiplier} punti`);
      this.multiplierText.setColor(color);

      this.comboTimerBar.setFillStyle(parseInt(color.replace('#', '0x')));

      // Mostra UI
      this.comboText.setAlpha(1);
      this.multiplierText.setAlpha(1);
      this.comboTimerBar.setAlpha(1);
    }
  }

  /**
   * Effetto visivo per combo alto
   */
  showComboEffect() {
    if (this.currentCombo >= 5) {
      // Shake per combo alto
      const shakeIntensity = Math.min(0.003 + (this.currentCombo * 0.0005), 0.01);
      this.scene.cameras.main.shake(50, shakeIntensity);
    }

    // Scala animata del testo
    if (this.comboText.alpha > 0) {
      this.scene.tweens.add({
        targets: this.comboText,
        scale: { from: 1.3, to: 1 },
        duration: 150,
        ease: 'Back.out'
      });
    }
  }

  /**
   * Mostra messaggio fine combo
   */
  showComboEndMessage() {
    if (this.currentCombo < 5) return;

    const message = this.scene.add.text(320, 200,
      `Combo x${this.currentCombo} terminato!`, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ff8800',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    });
    message.setOrigin(0.5);
    message.setScrollFactor(0);
    message.setDepth(100);

    this.scene.tweens.add({
      targets: message,
      y: message.y - 30,
      alpha: 0,
      duration: 1500,
      onComplete: () => message.destroy()
    });
  }

  /**
   * Ottieni statistiche
   */
  getStats() {
    return {
      currentCombo: this.currentCombo,
      maxCombo: this.maxCombo,
      multiplier: this.getMultiplier()
    };
  }
}
