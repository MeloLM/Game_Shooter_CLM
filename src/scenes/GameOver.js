import { Scene } from "phaser";
import { AudioManager } from "../managers/AudioManager.js";

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
    const gameOverText = this.add.text(320, 50, 'GAME OVER', {
      fontFamily: 'Verdana, sans-serif',
      fontSize: '36px',
      color: '#ff4444',
      fontStyle: 'bold'
    });
    gameOverText.setOrigin(0.5);

    // Statistiche partita
    const scoreText = this.add.text(320, 110, `Enemies Killed: ${this.finalScore}`, {
      fontFamily: 'Verdana',
      fontSize: '20px',
      color: '#ffffff'
    });
    scoreText.setOrigin(0.5);

    // Tempo di sopravvivenza
    const minutes = Math.floor(this.survivalTime / 60);
    const seconds = Math.floor(this.survivalTime % 60);
    const timeText = this.add.text(320, 140, `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`, {
      fontFamily: 'Verdana',
      fontSize: '16px',
      color: '#aaaaaa'
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
    const highScorePrefix = isNewRecord ? 'NEW RECORD! ' : '';

    const highScoreText = this.add.text(320, 175, `${highScorePrefix}High Score: ${highScoreDisplay}`, {
      fontFamily: 'Verdana',
      fontSize: '14px',
      color: highScoreColor
    });
    highScoreText.setOrigin(0.5);

    // Mostra trofei sbloccati
    const saved = localStorage.getItem('achievements_unlocked');
    const unlocked = saved ? JSON.parse(saved) : [];
    const trophyText = this.add.text(320, 200, `Trophies: ${unlocked.length}/16`, {
      fontFamily: 'Verdana',
      fontSize: '12px',
      color: '#ffd700'
    });
    trophyText.setOrigin(0.5);

    // --- BOTTONI UNIFORMI (Stile Minimalista Bianco) ---

    // Bottone RIPROVA
    const retryButton = this.add.rectangle(320, 255, 180, 45, 0xffffff);
    retryButton.setStrokeStyle(2, 0x333333);
    retryButton.setInteractive({ useHandCursor: true });

    const retryText = this.add.text(320, 255, 'RETRY', {
      fontFamily: 'Verdana',
      fontSize: '18px',
      color: '#111111',
      fontStyle: 'bold'
    });
    retryText.setOrigin(0.5);

    retryButton.on('pointerover', () => {
      retryButton.setFillStyle(0xdddddd);
    });
    retryButton.on('pointerout', () => {
      retryButton.setFillStyle(0xffffff);
    });
    retryButton.on('pointerdown', () => {
      if (!this.audioStarted) {
        this.audioManager.playMenuBGM();
        this.audioStarted = true;
      }
      if (this.audioManager) this.audioManager.stopAllBGM();
      this.scene.start('Level');
    });

    // Bottone MENU
    const menuButton = this.add.rectangle(320, 310, 180, 40, 0xffffff);
    menuButton.setStrokeStyle(2, 0x333333);
    menuButton.setInteractive({ useHandCursor: true });

    const menuText = this.add.text(320, 310, 'MAIN MENU', {
      fontFamily: 'Verdana',
      fontSize: '16px',
      color: '#111111'
    });
    menuText.setOrigin(0.5);

    menuButton.on('pointerover', () => {
      menuButton.setFillStyle(0xdddddd);
    });
    menuButton.on('pointerout', () => {
      menuButton.setFillStyle(0xffffff);
    });
    menuButton.on('pointerdown', () => {
      if (!this.audioStarted) {
        this.audioManager.playMenuBGM();
        this.audioStarted = true;
      }
      if (this.audioManager) this.audioManager.stopAllBGM();
      this.scene.start('MainMenu');
    });
  }
}
