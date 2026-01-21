import { Scene } from "phaser";
import { AudioManager } from "../managers/AudioManager.js";

export class MainMenu extends Scene {
  constructor() {
    super({ key: 'MainMenu' });
  }

  preload() {
    // Carica audio
    this.audioManager = new AudioManager(this);
    this.audioManager.preloadSounds();
  }

  create() {
    // Inizializza audio menu (ma non avvia ancora per policy browser)
    this.audioManager.initSounds();

    // Flag per tracking primo click
    this.audioStarted = false;

    // Create gradient texture
    const graphics = this.make.graphics();
    graphics.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
    graphics.fillRect(0, 0, 640, 360);
    graphics.generateTexture('gradient_bg', 640, 360);
    graphics.destroy();

    // Add gradient background
    this.add.image(320, 180, 'gradient_bg');

    // Decorative Particles for color
    this.createBackgroundParticles();

    // Titolo del gioco (Clean & Centered)
    const title = this.add.text(320, 100, 'KNIGHT SHOOTER', {
      fontFamily: 'Verdana, sans-serif',
      fontSize: '36px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Sottotitolo
    const subtitle = this.add.text(320, 140, 'Survival Arena', {
      fontFamily: 'Verdana, sans-serif',
      fontSize: '16px',
      color: '#888888',
      letterSpacing: 2
    }).setOrigin(0.5);

    // --- BOTTONI COLORATI ---

    // PLAY BUTTON (Green Accent)
    const playBtn = this.createButton(320, 200, 'START GAME', () => {
      if (!this.audioStarted) {
        this.audioManager.playMenuBGM();
        this.audioStarted = true;
      }
      this.audioManager.stopBGM();
      this.scene.start('Level');
    }, 0x00ff88);

    // TROFEI BUTTON (Gold Accent)
    const trophyBtn = this.createButton(320, 255, 'TROPHIES', () => {
      if (!this.audioStarted) {
        this.audioManager.playMenuBGM();
        this.audioStarted = true;
      }
      this.scene.start('TrophyScreen', { from: 'MainMenu' });
    }, 0xffd700);

    // SETTINGS BUTTON (Blue Accent)
    const settingsBtn = this.createButton(320, 310, 'SETTINGS', () => {
      if (!this.audioStarted) {
        this.audioManager.playMenuBGM();
        this.audioStarted = true;
      }
      this.scene.start('Settings', { from: 'MainMenu' });
    }, 0x00ccff);

    // High Score (Bottom)
    const highScore = localStorage.getItem('knightShooter_highScore') || 0;
    this.add.text(320, 340, `High Score: ${highScore}`, {
      fontFamily: 'Verdana',
      fontSize: '12px',
      color: '#444444'
    }).setOrigin(0.5);
  }

  createButton(x, y, text, callback, color = 0xffffff) {
    const button = this.add.container(x, y);

    // Background trasparente per hit area ma con bordo colorato
    const bg = this.add.rectangle(0, 0, 200, 45, 0x000000, 0.3);
    bg.setStrokeStyle(2, color);
    bg.setInteractive({ useHandCursor: true });

    const label = this.add.text(0, 0, text, {
      fontFamily: 'Verdana',
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    button.add([bg, label]);

    bg.on('pointerover', () => {
      bg.setFillStyle(color, 0.2); // Glow effect
      label.setScale(1.05);
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(0x000000, 0.3);
      label.setScale(1);
    });

    bg.on('pointerdown', callback);

    return button;
  }

  createBackgroundParticles() {
    const particles = this.add.particles(320, 180, 'coin', {
      speed: { min: 20, max: 60 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.2, end: 0 },
      alpha: { start: 0.3, end: 0 },
      lifespan: 3000,
      frequency: 500,
      blendMode: 'ADD'
    });

    // Colored floating orbs
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(0, 640);
      const y = Phaser.Math.Between(0, 360);
      const color = Phaser.Utils.Array.GetRandom([0xff0000, 0x00ff00, 0x0000ff, 0xffff00]);
      const circle = this.add.circle(x, y, Phaser.Math.Between(2, 5), color, 0.3);

      this.tweens.add({
        targets: circle,
        y: y - 50,
        alpha: 0,
        duration: Phaser.Math.Between(2000, 5000),
        repeat: -1,
        yoyo: true
      });
    }
  }
}
