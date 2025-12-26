import { Physics } from "phaser";

/**
 * Classe base per tutte le pozioni del gioco.
 * Contiene la logica comune per animazioni e comportamento.
 */
export class Bottle extends Physics.Arcade.Sprite {
  // Proprietà base (da sovrascrivere nelle sottoclassi)
  potionName = 'Potion';
  potionColor = '#ffffff';
  effectDuration = 0; // 0 = effetto istantaneo
  
  constructor(scene, x, y, texture, config = {}) {
    super(scene, x, y, texture);
    
    // Applica configurazione
    this.potionName = config.potionName || this.potionName;
    this.potionColor = config.potionColor || this.potionColor;
    this.effectDuration = config.effectDuration || this.effectDuration;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Scala standard
    this.setScale(0.5);
    
    // Collisione con il mondo
    this.setCollideWorldBounds(true);
  }
  
  /**
   * Crea l'animazione della pozione
   */
  createAnimation(scene, key, texture, startFrame = 0, endFrame = 7, frameRate = 8) {
    if (!scene.anims.exists(key)) {
      scene.anims.create({
        key: key,
        repeat: -1,
        frameRate: frameRate,
        frames: scene.anims.generateFrameNumbers(texture, {
          start: startFrame,
          end: endFrame,
        })
      });
    }
    this.play(key);
  }
  
  /**
   * Applica l'effetto della pozione (da sovrascrivere)
   * @param {Player} player - Il giocatore che ha raccolto la pozione
   * @param {Scene} scene - La scena di gioco
   */
  applyEffect(player, scene) {
    // Da implementare nelle sottoclassi
  }
  
  /**
   * Ottieni informazioni sulla pozione
   */
  getInfo() {
    return {
      name: this.potionName,
      color: this.potionColor,
      duration: this.effectDuration
    };
  }
}
