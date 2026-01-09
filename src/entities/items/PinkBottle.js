import { Bottle } from "./Bottle.js";

/**
 * PinkBottle - Power-up Magnet
 * Attira automaticamente le pozioni e monete verso il player
 */
export class PinkBottle extends Bottle {
  constructor(scene, x, y) {
    super(scene, x, y, "potion");
    
    // Tint rosa/magenta per distinguerla
    this.setTint(0xff69b4);
    
    // Effetto magnetico pulsante
    this.createMagnetEffect(scene);
  }
  
  /**
   * Crea effetto visivo magnetico
   */
  createMagnetEffect(scene) {
    // Cerchi concentrici che si contraggono
    const createRing = () => {
      if (!this.active) return;
      
      const ring = scene.add.circle(this.x, this.y, 20, 0xff69b4, 0);
      ring.setStrokeStyle(1, 0xff69b4, 0.5);
      ring.setDepth(4);
      
      scene.tweens.add({
        targets: ring,
        scale: 0.3,
        alpha: 0,
        duration: 800,
        onComplete: () => ring.destroy()
      });
    };
    
    // Ripeti effetto
    scene.time.addEvent({
      delay: 500,
      repeat: -1,
      callback: createRing
    });
  }
  
  /**
   * Applica effetto Magnet
   */
  applyEffect(scene, player) {
    const duration = 8000; // 8 secondi
    const magnetRange = 100; // Raggio di attrazione
    
    // Attiva magnet mode
    player.magnetMode = true;
    player.magnetRange = magnetRange;
    
    // Visual feedback
    this.createMagnetAura(scene, player, duration);
    
    // UI indicator
    this.showMagnetUI(scene, duration);
    
    // Timer per disattivare
    scene.time.delayedCall(duration, () => {
      this.deactivateMagnet(player);
    });
  }
  
  /**
   * Crea aura magnetica intorno al player
   */
  createMagnetAura(scene, player, duration) {
    // Cerchio che rappresenta il range
    const aura = scene.add.circle(player.x, player.y, player.magnetRange, 0xff69b4, 0.1);
    aura.setStrokeStyle(1, 0xff69b4, 0.3);
    aura.setDepth(3);
    
    // Segui il player
    const updateAura = () => {
      if (!player.magnetMode || !player.active || !aura.active) {
        aura.destroy();
        return;
      }
      aura.setPosition(player.x, player.y);
    };
    
    // Update ogni frame
    scene.events.on('update', updateAura);
    
    // Cleanup dopo durata
    scene.time.delayedCall(duration, () => {
      scene.events.off('update', updateAura);
      if (aura.active) {
        scene.tweens.add({
          targets: aura,
          alpha: 0,
          scale: 0,
          duration: 300,
          onComplete: () => aura.destroy()
        });
      }
    });
    
    // Pulsazione
    scene.tweens.add({
      targets: aura,
      scale: { from: 1, to: 1.1 },
      alpha: { from: 0.1, to: 0.2 },
      duration: 500,
      yoyo: true,
      repeat: Math.floor(duration / 1000)
    });
  }
  
  /**
   * Mostra UI magnet
   */
  showMagnetUI(scene, duration) {
    const magnetText = scene.add.text(320, 50, '🧲 MAGNET ACTIVE 🧲', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ff69b4',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    });
    magnetText.setOrigin(0.5);
    magnetText.setScrollFactor(0);
    magnetText.setDepth(100);
    
    // Timer bar
    const timerBar = scene.add.rectangle(320, 63, 80, 3, 0xff69b4);
    timerBar.setScrollFactor(0);
    timerBar.setDepth(100);
    
    scene.tweens.add({
      targets: timerBar,
      scaleX: 0,
      duration: duration,
      ease: 'Linear',
      onComplete: () => {
        magnetText.destroy();
        timerBar.destroy();
      }
    });
  }
  
  /**
   * Disattiva magnet mode
   */
  deactivateMagnet(player) {
    if (!player.active) return;
    
    player.magnetMode = false;
    player.magnetRange = 0;
  }
}
