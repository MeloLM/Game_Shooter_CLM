/**
 * AudioManager - Gestisce tutti i suoni del gioco
 * 
 * Per aggiungere file audio, inserirli nella cartella assets/audio/
 * Formati supportati: mp3, ogg, wav
 * 
 * File richiesti (opzionali - il gioco funziona anche senza):
 * - bgm_main.mp3      : Musica di sottofondo
 * - sfx_attack.mp3    : Suono attacco
 * - sfx_hit.mp3       : Suono danno ricevuto
 * - sfx_enemy_die.mp3 : Suono morte nemico
 * - sfx_pickup.mp3    : Suono raccolta pozione
 * - sfx_gameover.mp3  : Suono game over
 */

export class AudioManager {
  constructor(scene) {
    this.scene = scene;
    this.isMuted = false;
    this.bgmVolume = 0.3;
    this.sfxVolume = 0.5;
    this.sounds = {};
  }

  // Carica tutti i suoni (chiamare in preload)
  preloadSounds() {
    try {
      // Background Music
      this.scene.load.audio('bgm_main', 'assets/audio/bgm_main.mp3');
      
      // Sound Effects
      this.scene.load.audio('sfx_attack', 'assets/audio/sfx_attack.mp3');
      this.scene.load.audio('sfx_hit', 'assets/audio/sfx_hit.mp3');
      this.scene.load.audio('sfx_enemy_die', 'assets/audio/sfx_enemy_die.mp3');
      this.scene.load.audio('sfx_pickup', 'assets/audio/sfx_pickup.mp3');
      this.scene.load.audio('sfx_gameover', 'assets/audio/sfx_gameover.mp3');
    } catch (e) {
      console.log('Audio files not found - continuing without audio');
    }
  }

  // Inizializza i suoni (chiamare in create)
  initSounds() {
    try {
      // Crea riferimenti ai suoni se esistono
      if (this.scene.cache.audio.exists('bgm_main')) {
        this.sounds.bgm = this.scene.sound.add('bgm_main', { 
          loop: true, 
          volume: this.bgmVolume 
        });
      }
      
      if (this.scene.cache.audio.exists('sfx_attack')) {
        this.sounds.attack = this.scene.sound.add('sfx_attack', { volume: this.sfxVolume });
      }
      
      if (this.scene.cache.audio.exists('sfx_hit')) {
        this.sounds.hit = this.scene.sound.add('sfx_hit', { volume: this.sfxVolume });
      }
      
      if (this.scene.cache.audio.exists('sfx_enemy_die')) {
        this.sounds.enemyDie = this.scene.sound.add('sfx_enemy_die', { volume: this.sfxVolume });
      }
      
      if (this.scene.cache.audio.exists('sfx_pickup')) {
        this.sounds.pickup = this.scene.sound.add('sfx_pickup', { volume: this.sfxVolume });
      }
      
      if (this.scene.cache.audio.exists('sfx_gameover')) {
        this.sounds.gameover = this.scene.sound.add('sfx_gameover', { volume: this.sfxVolume });
      }
    } catch (e) {
      console.log('Error initializing audio:', e);
    }
  }

  // Avvia la musica di background
  playBGM() {
    if (this.sounds.bgm && !this.isMuted) {
      this.sounds.bgm.play();
    }
  }

  // Ferma la musica di background
  stopBGM() {
    if (this.sounds.bgm) {
      this.sounds.bgm.stop();
    }
  }

  // Riproduci effetto sonoro
  play(soundName) {
    if (this.isMuted) return;
    
    const soundMap = {
      'attack': this.sounds.attack,
      'hit': this.sounds.hit,
      'enemyDie': this.sounds.enemyDie,
      'pickup': this.sounds.pickup,
      'gameover': this.sounds.gameover
    };

    const sound = soundMap[soundName];
    if (sound) {
      sound.play();
    }
  }

  // Toggle mute
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      this.scene.sound.mute = true;
    } else {
      this.scene.sound.mute = false;
    }
    
    return this.isMuted;
  }

  // Imposta volume BGM
  setBGMVolume(volume) {
    this.bgmVolume = volume;
    if (this.sounds.bgm) {
      this.sounds.bgm.setVolume(volume);
    }
  }

  // Imposta volume SFX
  setSFXVolume(volume) {
    this.sfxVolume = volume;
    Object.keys(this.sounds).forEach(key => {
      if (key !== 'bgm' && this.sounds[key]) {
        this.sounds[key].setVolume(volume);
      }
    });
  }
}
