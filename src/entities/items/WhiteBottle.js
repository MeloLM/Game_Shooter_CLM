import { Bottle } from "./Bottle.js";

/**
 * WhiteBottle - Power-up Frenzy Mode
 * Raddoppia la velocità di attacco per 5 secondi
 */
export class WhiteBottle extends Bottle {
  constructor(scene, x, y) {
    super(scene, x, y, "potion");
    
    // Tint bianco/argento per distinguerla
    this.setTint(0xffffff);
    
    // Effetto glow pulsante
    this.createGlowEffect(scene);
  }
  
  /**
   * Crea effetto glow pulsante
   */
  createGlowEffect(scene) {
    scene.tweens.add({
      targets: this,
      alpha: { from: 1, to: 0.6 },
      scale: { from: 0.5, to: 0.6 },
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
  
  /**
   * Applica effetto Frenzy Mode
   */
  applyEffect(scene, player) {
    // Attiva frenzy mode
    player.frenzyMode = true;
    player.frenzyMultiplier = 2; // Velocità attacco x2
    
    // Visual feedback sul player
    player.setTint(0xffaa00);
    
    // Effetto particelle
    this.createFrenzyParticles(scene, player);
    
    // UI indicator
    this.showFrenzyUI(scene);
    
    // Timer per disattivare
    scene.time.delayedCall(5000, () => {
      this.deactivateFrenzy(scene, player);
    });
  }
  
  /**
   * Crea particelle frenzy
   */
  createFrenzyParticles(scene, player) {
    // Crea emitter di particelle intorno al player
    const emitParticle = () => {
      if (!player.frenzyMode || !player.active) return;
      
      const angle = Math.random() * Math.PI * 2;
      const particle = scene.add.circle(
        player.x + Math.cos(angle) * 15,
        player.y + Math.sin(angle) * 15,
        2,
        0xffaa00
      );
      particle.setDepth(4);
      
      scene.tweens.add({
        targets: particle,
        y: particle.y - 10,
        alpha: 0,
        duration: 300,
        onComplete: () => particle.destroy()
      });
    };
    
    // Emetti particelle ogni 100ms per 5 secondi
    const particleEvent = scene.time.addEvent({
      delay: 100,
      repeat: 49,
      callback: emitParticle
    });
  }
  
  /**
   * Mostra UI frenzy
   */
  showFrenzyUI(scene) {
    const frenzyText = scene.add.text(320, 50, '⚡ FRENZY MODE ⚡', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffaa00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    });
    frenzyText.setOrigin(0.5);
    frenzyText.setScrollFactor(0);
    frenzyText.setDepth(100);
    
    // Pulsazione
    scene.tweens.add({
      targets: frenzyText,
      scale: { from: 1, to: 1.1 },
      alpha: { from: 1, to: 0.8 },
      duration: 200,
      yoyo: true,
      repeat: 24 // 5 secondi
    });
    
    // Timer bar
    const timerBar = scene.add.rectangle(320, 65, 100, 4, 0xffaa00);
    timerBar.setScrollFactor(0);
    timerBar.setDepth(100);
    
    scene.tweens.add({
      targets: timerBar,
      scaleX: 0,
      duration: 5000,
      ease: 'Linear',
      onComplete: () => {
        frenzyText.destroy();
        timerBar.destroy();
      }
    });
  }
  
  /**
   * Disattiva frenzy mode
   */
  deactivateFrenzy(scene, player) {
    if (!player.active) return;
    
    player.frenzyMode = false;
    player.frenzyMultiplier = 1;
    player.clearTint();
    
    // Flash finale
    player.setTint(0xffffff);
    scene.time.delayedCall(100, () => {
      if (player.active) player.clearTint();
    });
  }
}
