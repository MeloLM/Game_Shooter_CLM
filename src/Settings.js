import { Scene } from "phaser";

export class Settings extends Scene {
  constructor() {
    super({ key: 'Settings' });
  }

  init(data) {
    this.fromScene = data?.from || 'MainMenu';
  }

  create() {
    // Carica impostazioni salvate
    this.loadSettings();

    // Sfondo
    this.add.rectangle(320, 180, 640, 360, 0x1a1a2e);

    // Bottone INDIETRO in alto a sinistra
    const backButton = this.add.rectangle(80, 25, 130, 35, 0x8B4513);
    backButton.setStrokeStyle(2, 0xffd700);
    backButton.setInteractive({ useHandCursor: true });
    
    const backText = this.add.text(80, 25, '← MENU', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    backText.setOrigin(0.5);

    backButton.on('pointerover', () => {
      backButton.setFillStyle(0xA0522D);
      backButton.setStrokeStyle(2, 0xffee00);
      backText.setScale(1.1);
    });
    backButton.on('pointerout', () => {
      backButton.setFillStyle(0x8B4513);
      backButton.setStrokeStyle(2, 0xffd700);
      backText.setScale(1);
    });
    backButton.on('pointerdown', () => {
      this.scene.start(this.fromScene);
    });

    // Titolo
    const title = this.add.text(320, 40, '⚙️ IMPOSTAZIONI', {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    });
    title.setOrigin(0.5);

    // === SEZIONE CONTROLLI MOBILE ===
    const mobileTitle = this.add.text(320, 95, '📱 Controlli Mobile', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    mobileTitle.setOrigin(0.5);

    // Toggle controlli mobile
    this.mobileToggle = this.createToggle(320, 135, 'Frecce direzionali', this.settings.mobileControls, (value) => {
      this.settings.mobileControls = value;
      this.saveSettings();
    });

    // === SEZIONE AUDIO ===
    const audioTitle = this.add.text(320, 185, '🔊 Audio', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    audioTitle.setOrigin(0.5);

    // Toggle musica
    this.musicToggle = this.createToggle(320, 220, 'Musica di sottofondo', this.settings.music, (value) => {
      this.settings.music = value;
      this.saveSettings();
    });

    // Toggle effetti sonori
    this.sfxToggle = this.createToggle(320, 260, 'Effetti sonori', this.settings.sfx, (value) => {
      this.settings.sfx = value;
      this.saveSettings();
    });

    // === SEZIONE GRAFICA ===
    const graphicsTitle = this.add.text(320, 275, '🎨 Grafica', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    graphicsTitle.setOrigin(0.5);

    // Toggle particelle
    this.particlesToggle = this.createToggle(320, 315, 'Effetti particelle', this.settings.particles, (value) => {
      this.settings.particles = value;
      this.saveSettings();
    });

    // Info mobile
    const infoText = this.add.text(320, 345, 
      'Le frecce direzionali appariranno sullo schermo\nper facilitare il gioco su dispositivi touch', {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: '#666666',
      align: 'center'
    });
    infoText.setOrigin(0.5);
  }

  /**
   * Crea un toggle switch
   */
  createToggle(x, y, label, initialValue, onChange) {
    const container = this.add.container(x, y);

    // Label
    const labelText = this.add.text(-120, 0, label, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#cccccc'
    });
    labelText.setOrigin(0, 0.5);

    // Toggle background
    const toggleBg = this.add.rectangle(120, 0, 60, 28, initialValue ? 0x4CAF50 : 0x666666, 1);
    toggleBg.setStrokeStyle(2, 0x333333);
    toggleBg.setInteractive({ useHandCursor: true });

    // Toggle knob
    const knob = this.add.circle(initialValue ? 140 : 100, 0, 10, 0xffffff);

    // Status text
    const statusText = this.add.text(120, 0, initialValue ? 'ON' : 'OFF', {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    statusText.setOrigin(0.5);

    container.add([labelText, toggleBg, knob, statusText]);

    // Toggle state
    let isOn = initialValue;

    toggleBg.on('pointerdown', () => {
      isOn = !isOn;
      
      // Animazione toggle
      this.tweens.add({
        targets: knob,
        x: isOn ? 140 : 100,
        duration: 150,
        ease: 'Power2'
      });

      // Aggiorna colore e testo
      toggleBg.setFillStyle(isOn ? 0x4CAF50 : 0x666666);
      statusText.setText(isOn ? 'ON' : 'OFF');

      // Callback
      if (onChange) {
        onChange(isOn);
      }
    });

    return { container, getValue: () => isOn };
  }

  /**
   * Carica impostazioni da localStorage
   */
  loadSettings() {
    const saved = localStorage.getItem('knightShooter_settings');
    if (saved) {
      try {
        this.settings = JSON.parse(saved);
      } catch (e) {
        this.settings = this.getDefaultSettings();
      }
    } else {
      this.settings = this.getDefaultSettings();
    }
  }

  /**
   * Salva impostazioni in localStorage
   */
  saveSettings() {
    localStorage.setItem('knightShooter_settings', JSON.stringify(this.settings));
  }

  /**
   * Impostazioni predefinite
   */
  getDefaultSettings() {
    return {
      mobileControls: false,
      music: true,
      sfx: true,
      particles: true
    };
  }
}
