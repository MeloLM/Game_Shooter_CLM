/**
 * PauseManager.js
 * Gestisce il sistema di pausa del gioco
 * Seguendo il pattern Event-Driven dell'architettura
 */
export class PauseManager {
  constructor(scene) {
    this.scene = scene;
    this.isPaused = false;
    
    // Elementi UI della pausa
    this.pauseOverlay = null;
    this.pauseText = null;
    this.pauseInstructions = null;
    this.pauseTrophyPanel = null;
    this.pauseTrophyText = null;
  }

  /**
   * Crea tutti gli elementi UI per la pausa
   */
  create() {
    // Overlay scuro per la pausa
    this.pauseOverlay = this.scene.add.rectangle(320, 180, 640, 360, 0x000000, 0.7);
    this.pauseOverlay.setScrollFactor(0);
    this.pauseOverlay.setDepth(100);
    this.pauseOverlay.setVisible(false);

    // Testo PAUSA
    this.pauseText = this.scene.add.text(320, 150, 'PAUSA', {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    this.pauseText.setOrigin(0.5);
    this.pauseText.setScrollFactor(0);
    this.pauseText.setDepth(101);
    this.pauseText.setVisible(false);

    // Testo istruzioni pausa
    this.pauseInstructions = this.scene.add.text(320, 200, 'Premi ESC o P per riprendere', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#cccccc'
    });
    this.pauseInstructions.setOrigin(0.5);
    this.pauseInstructions.setScrollFactor(0);
    this.pauseInstructions.setDepth(101);
    this.pauseInstructions.setVisible(false);

    // Pannello trofei per la pausa
    this.pauseTrophyPanel = this.scene.add.container(320, 280);
    this.pauseTrophyPanel.setScrollFactor(0);
    this.pauseTrophyPanel.setDepth(101);
    this.pauseTrophyPanel.setVisible(false);
    
    // Sfondo pannello trofei
    const trophyBg = this.scene.add.rectangle(0, 0, 400, 100, 0x1a1a2e, 0.9);
    trophyBg.setStrokeStyle(2, 0xffd700);
    this.pauseTrophyPanel.add(trophyBg);
    
    // Titolo trofei
    const trophyTitle = this.scene.add.text(0, -35, '🏆 TROFEI PARTITA', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffd700',
      fontStyle: 'bold'
    });
    trophyTitle.setOrigin(0.5);
    this.pauseTrophyPanel.add(trophyTitle);
    
    // Testo trofei
    this.pauseTrophyText = this.scene.add.text(0, 5, '', {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: '#ffffff',
      align: 'center'
    });
    this.pauseTrophyText.setOrigin(0.5);
    this.pauseTrophyPanel.add(this.pauseTrophyText);

    // Setup input per pausa
    this.setupInput();
  }

  /**
   * Configura gli input per la pausa
   */
  setupInput() {
    this.scene.input.keyboard.on('keydown-ESC', () => this.toggle());
    this.scene.input.keyboard.on('keydown-P', () => this.toggle());
  }

  /**
   * Toggle pausa on/off
   */
  toggle() {
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      this.pause();
    } else {
      this.resume();
    }
    
    // Emit evento per notificare altri sistemi
    this.scene.events.emit('pauseStateChanged', this.isPaused);
  }

  /**
   * Mette in pausa il gioco
   */
  pause() {
    this.scene.physics.pause();
    this.pauseOverlay.setVisible(true);
    this.pauseText.setVisible(true);
    this.pauseInstructions.setVisible(true);
    
    // Mostra pannello trofei
    if (this.pauseTrophyPanel && this.scene.achievementSystem) {
      this.pauseTrophyPanel.setVisible(true);
      this.updateTrophies();
    }
  }

  /**
   * Riprende il gioco
   */
  resume() {
    this.scene.physics.resume();
    this.pauseOverlay.setVisible(false);
    this.pauseText.setVisible(false);
    this.pauseInstructions.setVisible(false);
    
    if (this.pauseTrophyPanel) {
      this.pauseTrophyPanel.setVisible(false);
    }
  }

  /**
   * Aggiorna il pannello trofei nella pausa
   */
  updateTrophies() {
    if (!this.scene.achievementSystem || !this.pauseTrophyText) return;
    
    const unlocked = this.scene.achievementSystem.unlockedAchievements;
    const total = this.scene.achievementSystem.getTotalCount();
    
    if (unlocked.length === 0) {
      this.pauseTrophyText.setText('Nessun trofeo sbloccato ancora.\nUccidi nemici, sopravvivi e fai combo!');
    } else {
      const trophyNames = unlocked.map(id => {
        const ach = this.scene.achievementSystem.achievements.find(a => a.id === id);
        return ach ? `${ach.icon} ${ach.name}` : id;
      });
      this.pauseTrophyText.setText(`Sbloccati: ${unlocked.length}/${total}\n${trophyNames.join(' | ')}`);
    }
  }

  /**
   * Ritorna lo stato di pausa
   * @returns {boolean}
   */
  getIsPaused() {
    return this.isPaused;
  }
}
