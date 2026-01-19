import { Scene } from "phaser";
import { AudioManager } from "../managers/AudioManager.js";

export class MainMenu extends Scene {
  constructor() {
    super({ key: 'MainMenu' });
  }

  preload() {
    // Carica assets per il menu
    this.load.image("menu_bg", "assets/tilesheet.png");

    // Carica audio
    this.audioManager = new AudioManager(this);
    this.audioManager.preloadSounds();

    // Carica coin per decorazione
    this.load.image("coin", "assets/items/coin.png");
  }

  create() {
    // Inizializza audio menu (ma non avvia ancora per policy browser)
    this.audioManager.initSounds();

    // Flag per tracking primo click
    this.audioStarted = false;

    // Sfondo
    this.add.rectangle(320, 180, 640, 360, 0x1a1a2e);

    // Titolo del gioco
    // Titolo del gioco (Simple, Clean)
    const title = this.add.text(320, 80, 'KNIGHT SHOOTER', {
      fontFamily: 'Verdana, sans-serif',
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5);

    // Coin decorativa (keep them, they are fine)
    if (this.textures.exists('coin')) {
      this.menuCoin1 = this.add.image(120, 180, 'coin').setScale(3).setAlpha(0.6);
      this.menuCoin2 = this.add.image(520, 180, 'coin').setScale(3).setAlpha(0.6);

      this.tweens.add({
        targets: [this.menuCoin1, this.menuCoin2],
        scaleX: 0,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // Sottotitolo
    const subtitle = this.add.text(320, 120, 'Survival Arena', {
      fontFamily: 'Verdana',
      fontSize: '16px',
      color: '#aaaaaa'
    });
    subtitle.setOrigin(0.5);

    // PLAY BUTTON (Minimalist)
    const playButton = this.add.rectangle(320, 200, 200, 50, 0xffffff); // White btn
    playButton.setStrokeStyle(2, 0x000000);
    playButton.setInteractive({ useHandCursor: true });

    const playText = this.add.text(320, 200, 'START GAME', {
      fontFamily: 'Verdana',
      fontSize: '20px',
      color: '#000000', // Black text on white
      fontStyle: 'bold'
    });
    playText.setOrigin(0.5);

    // Hover effect per PLAY
    playButton.on('pointerover', () => {
      playButton.setFillStyle(0xeeeeee);
      playText.setScale(1.05);
    });
    playButton.on('pointerout', () => {
      playButton.setFillStyle(0xffffff);
      playText.setScale(1);
    });
    playButton.on('pointerdown', () => {
      // Avvia audio al primo click (per policy browser)
      if (!this.audioStarted) {
        this.audioManager.playMenuBGM();
        this.audioStarted = true;
      }
      this.audioManager.stopBGM();
      this.scene.start('Level');
    });

    // Bottone TROFEI
    const trophyButton = this.add.rectangle(320, 255, 140, 35, 0x8a6a2a);
    trophyButton.setInteractive({ useHandCursor: true });

    const trophyText = this.add.text(320, 255, '🏆 TROFEI', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    trophyText.setOrigin(0.5);

    trophyButton.on('pointerover', () => {
      trophyButton.setFillStyle(0xaa8a4a);
      trophyText.setScale(1.1);
    });
    trophyButton.on('pointerout', () => {
      trophyButton.setFillStyle(0x8a6a2a);
      trophyText.setScale(1);
    });
    trophyButton.on('pointerdown', () => {
      // Avvia audio al primo click (per policy browser)
      if (!this.audioStarted) {
        this.audioManager.playMenuBGM();
        this.audioStarted = true;
      }
      this.scene.start('TrophyScreen', { from: 'MainMenu' });
    });

    // Bottone IMPOSTAZIONI
    const settingsButton = this.add.rectangle(320, 295, 160, 35, 0x4a6a4a);
    settingsButton.setInteractive({ useHandCursor: true });

    const settingsText = this.add.text(320, 295, '⚙️ IMPOSTAZIONI', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    settingsText.setOrigin(0.5);

    settingsButton.on('pointerover', () => {
      settingsButton.setFillStyle(0x6a8a6a);
      settingsText.setScale(1.1);
    });
    settingsButton.on('pointerout', () => {
      settingsButton.setFillStyle(0x4a6a4a);
      settingsText.setScale(1);
    });
    settingsButton.on('pointerdown', () => {
      // Avvia audio al primo click (per policy browser)
      if (!this.audioStarted) {
        this.audioManager.playMenuBGM();
        this.audioStarted = true;
      }
      this.scene.start('Settings', { from: 'MainMenu' });
    });

    // Istruzioni
    const instructions = this.add.text(320, 340,
      '🎮 WASD - Movimento | CLICK - Attacca | ESC - Pausa', {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: '#888888',
      align: 'center'
    });
    instructions.setOrigin(0.5);

    // High Score (se disponibile)
    const highScore = localStorage.getItem('knightShooter_highScore') || 0;
    const highScoreText = this.add.text(320, 360, `🏆 High Score: ${highScore}`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffd700'
    });
    highScoreText.setOrigin(0.5);

    // Animazione titolo
    this.tweens.add({
      targets: title,
      y: 85,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }


}
