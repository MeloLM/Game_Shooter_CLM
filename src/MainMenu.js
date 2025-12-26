import { Scene } from "phaser";
import { AudioManager } from "./AudioManager.js";

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
  }

  create() {
    // Inizializza e avvia audio menu
    this.audioManager.initSounds();
    this.audioManager.playMenuBGM();
    
    // Sfondo
    this.add.rectangle(320, 180, 640, 360, 0x1a1a2e);

    // Titolo del gioco
    const title = this.add.text(320, 80, '⚔️ KNIGHT SHOOTER ⚔️', {
      fontFamily: 'Arial',
      fontSize: '36px',
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    });
    title.setOrigin(0.5);

    // Sottotitolo
    const subtitle = this.add.text(320, 120, 'Survival Arena', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#cccccc'
    });
    subtitle.setOrigin(0.5);

    // Bottone PLAY
    const playButton = this.add.rectangle(320, 200, 180, 50, 0x4a4a8a);
    playButton.setInteractive({ useHandCursor: true });
    
    const playText = this.add.text(320, 200, '▶ GIOCA', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    playText.setOrigin(0.5);

    // Hover effect per PLAY
    playButton.on('pointerover', () => {
      playButton.setFillStyle(0x6a6aaa);
      playText.setScale(1.1);
    });
    playButton.on('pointerout', () => {
      playButton.setFillStyle(0x4a4a8a);
      playText.setScale(1);
    });
    playButton.on('pointerdown', () => {
      this.audioManager.stopBGM();
      this.scene.start('Level');
    });

    // Istruzioni (spostato su dato che non c'è più bottone trofei)
    const instructions = this.add.text(320, 270, 
      '🎮 CONTROLLI:\n' +
      'WASD - Movimento\n' +
      'CLICK - Attacca\n' +
      'ESC/P - Pausa', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#888888',
      align: 'center'
    });
    instructions.setOrigin(0.5);

    // High Score (se disponibile)
    const highScore = localStorage.getItem('knightShooter_highScore') || 0;
    const highScoreText = this.add.text(320, 340, `🏆 High Score: ${highScore}`, {
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
