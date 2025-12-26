/**
 * AudioManager - Gestisce tutti i suoni del gioco
 * 
 * File audio disponibili:
 * - Main_theme.mp3    : Musica gameplay
 * - Boss_theme.mp3    : Musica boss fight
 * - Menu_audio.wav    : Musica menu
 */

export class AudioManager {
  constructor(scene) {
    this.scene = scene;
    this.isMuted = false;
    this.bgmVolume = 0.3;
    this.sfxVolume = 0.5;
    this.sounds = {};
    this.currentBGM = null;
    
    // Carica impostazioni utente
    this.loadSettings();
  }
  
  /**
   * Carica impostazioni audio da localStorage
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem('knightShooter_settings');
      if (saved) {
        const settings = JSON.parse(saved);
        // Se musica è disabilitata, muta
        if (settings.music === false) {
          this.isMuted = true;
        }
        // SFX setting (per usi futuri)
        this.sfxEnabled = settings.sfx !== false;
      }
    } catch (e) {
      // Impostazioni default
    }
  }

  // Carica tutti i suoni (chiamare in preload)
  preloadSounds() {
    try {
      // Background Music
      this.scene.load.audio('bgm_menu', 'assets/audio/Menu_audio.wav');
      this.scene.load.audio('bgm_main', 'assets/audio/Main_theme.mp3');
      this.scene.load.audio('bgm_boss', 'assets/audio/Boss_theme.mp3');
    } catch (e) {
      // Audio files not available - continue silently
    }
  }

  // Inizializza i suoni (chiamare in create)
  initSounds() {
    try {
      // Menu BGM
      if (this.scene.cache.audio.exists('bgm_menu')) {
        this.sounds.menuBgm = this.scene.sound.add('bgm_menu', { 
          loop: true, 
          volume: this.bgmVolume 
        });
      }
      
      // Main gameplay BGM
      if (this.scene.cache.audio.exists('bgm_main')) {
        this.sounds.bgm = this.scene.sound.add('bgm_main', { 
          loop: true, 
          volume: this.bgmVolume 
        });
      }
      
      // Boss BGM
      if (this.scene.cache.audio.exists('bgm_boss')) {
        this.sounds.bossBgm = this.scene.sound.add('bgm_boss', { 
          loop: true, 
          volume: this.bgmVolume + 0.1
        });
      }
    } catch (e) {
      // Error initializing audio - continue silently
    }
  }

  // Avvia la musica del menu
  playMenuBGM() {
    this.stopAllBGM();
    if (this.sounds.menuBgm && !this.isMuted) {
      this.sounds.menuBgm.play();
      this.currentBGM = 'menu';
    }
  }

  // Avvia la musica di gameplay
  playBGM() {
    this.stopAllBGM();
    if (this.sounds.bgm && !this.isMuted) {
      this.sounds.bgm.play();
      this.currentBGM = 'main';
    }
  }

  // Avvia la musica boss
  playBossBGM() {
    this.stopAllBGM();
    if (this.sounds.bossBgm && !this.isMuted) {
      this.sounds.bossBgm.play();
      this.currentBGM = 'boss';
    }
  }

  // Ferma tutta la musica
  stopAllBGM() {
    if (this.sounds.menuBgm) this.sounds.menuBgm.stop();
    if (this.sounds.bgm) this.sounds.bgm.stop();
    if (this.sounds.bossBgm) this.sounds.bossBgm.stop();
    this.currentBGM = null;
  }

  // Ferma la musica di background
  stopBGM() {
    this.stopAllBGM();
  }

  // Riproduci effetto sonoro (placeholder per futuri SFX)
  play(soundName) {
    if (this.isMuted) return;
    // SFX placeholder - aggiungi i tuoi file audio qui
  }

  // Toggle mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.scene.sound.mute = this.isMuted;
    return this.isMuted;
  }

  // Imposta volume BGM
  setBGMVolume(volume) {
    this.bgmVolume = volume;
    if (this.sounds.bgm) this.sounds.bgm.setVolume(volume);
    if (this.sounds.menuBgm) this.sounds.menuBgm.setVolume(volume);
    if (this.sounds.bossBgm) this.sounds.bossBgm.setVolume(volume + 0.1);
  }
}
