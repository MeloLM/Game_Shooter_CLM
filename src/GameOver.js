import { Scene } from "phaser";
import { AudioManager } from "./AudioManager.js";

export class GameOver extends Scene {
  constructor() {
    super({ key: 'GameOver' });
  }

  init(data) {
    // Ricevi dati dalla scena Level
    this.finalScore = data.score || 0;
    this.survivalTime = data.time || 0;
  }

  preload() {
    // Carica audio per menu music
    this.audioManager = new AudioManager(this);
    this.audioManager.preloadSounds();
  }

  create() {
    // Inizializza audio (ma NON avvia - policy browser)
    this.audioManager.initSounds();
    
    // Flag per tracking primo click
    this.audioStarted = false;
    
    // Sfondo scuro
    this.add.rectangle(320, 180, 640, 360, 0x1a0a0a);

    // Titolo GAME OVER
    const gameOverText = this.add.text(320, 60, '💀 GAME OVER 💀', {
      fontFamily: 'Arial',
      fontSize: '40px',
      color: '#ff0000',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    });
    gameOverText.setOrigin(0.5);

    // Statistiche partita
    const scoreText = this.add.text(320, 130, `Nemici Uccisi: ${this.finalScore}`, {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff'
    });
    scoreText.setOrigin(0.5);

    // Tempo di sopravvivenza
    const minutes = Math.floor(this.survivalTime / 60);
    const seconds = Math.floor(this.survivalTime % 60);
    const timeText = this.add.text(320, 160, `Tempo: ${minutes}:${seconds.toString().padStart(2, '0')}`, {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#cccccc'
    });
    timeText.setOrigin(0.5);

    // Controlla e aggiorna High Score
    const currentHighScore = parseInt(localStorage.getItem('knightShooter_highScore')) || 0;
    let isNewRecord = false;
    
    if (this.finalScore > currentHighScore) {
      localStorage.setItem('knightShooter_highScore', this.finalScore);
      isNewRecord = true;
    }

    // High Score display
    const highScoreDisplay = isNewRecord ? this.finalScore : currentHighScore;
    const highScoreColor = isNewRecord ? '#ffd700' : '#888888';
    const highScorePrefix = isNewRecord ? '🎉 NUOVO RECORD! ' : '';
    
    const highScoreText = this.add.text(320, 195, `${highScorePrefix}🏆 High Score: ${highScoreDisplay}`, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: highScoreColor
    });
    highScoreText.setOrigin(0.5);

    // Mostra trofei sbloccati
    const saved = localStorage.getItem('achievements_unlocked');
    const unlocked = saved ? JSON.parse(saved) : [];
    const trophyText = this.add.text(320, 220, `🏆 Trofei: ${unlocked.length}/16`, {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ffd700'
    });
    trophyText.setOrigin(0.5);

    // Bottone RIPROVA
    const retryButton = this.add.rectangle(320, 270, 160, 45, 0x4a8a4a);
    retryButton.setInteractive({ useHandCursor: true });
    
    const retryText = this.add.text(320, 270, '🔄 RIPROVA', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    retryText.setOrigin(0.5);

    retryButton.on('pointerover', () => {
      retryButton.setFillStyle(0x6aaa6a);
      retryText.setScale(1.1);
    });
    retryButton.on('pointerout', () => {
      retryButton.setFillStyle(0x4a8a4a);
      retryText.setScale(1);
    });
    retryButton.on('pointerdown', () => {
      // Avvia audio al primo click (per policy browser)
      if (!this.audioStarted) {
        this.audioManager.playMenuBGM();
        this.audioStarted = true;
      }
      if (this.audioManager) this.audioManager.stopAllBGM();
      this.scene.start('Level');
    });

    // Bottone MENU
    const menuButton = this.add.rectangle(320, 325, 160, 45, 0x4a4a8a);
    menuButton.setInteractive({ useHandCursor: true });
    
    const menuText = this.add.text(320, 325, '🏠 MENU', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    menuText.setOrigin(0.5);

    menuButton.on('pointerover', () => {
      menuButton.setFillStyle(0x6a6aaa);
      menuText.setScale(1.1);
    });
    menuButton.on('pointerout', () => {
      menuButton.setFillStyle(0x4a4a8a);
      menuText.setScale(1);
    });
    menuButton.on('pointerdown', () => {
      // Avvia audio al primo click (per policy browser)
      if (!this.audioStarted) {
        this.audioManager.playMenuBGM();
        this.audioStarted = true;
      }
      if (this.audioManager) this.audioManager.stopAllBGM();
      this.scene.start('MainMenu');
    });

    // Animazione pulsante
    if (isNewRecord) {
      this.tweens.add({
        targets: highScoreText,
        scale: 1.1,
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    }
  }
}
