import { Physics } from "phaser";

/**
 * Coin - Moneta droppata dai nemici
 * Può essere raccolta dal player per accumulare valuta
 */
export class Coin extends Physics.Arcade.Sprite {
  value = 1;
  magnetRange = 0;  // Distanza a cui viene attratto (0 = no magnet)

  constructor(scene, x, y, value = 1) {
    super(scene, x, y, 'coin');

    this.value = value;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Setup sprite (usa un cerchio giallo come placeholder)
    this.createCoinGraphic(scene);

    // Bounce animation
    this.spawnAnimation(scene);

    // Auto-despawn dopo 15 secondi
    scene.time.delayedCall(15000, () => {
      if (this.active) {
        this.fadeOut(scene);
      }
    });
  }

  /**
   * Crea grafica della moneta
   */
  /**
   * Imposta sprite moneta
   */
  createCoinGraphic(scene) {
    this.setTexture('coin');
    this.setDepth(5);
  }

  /**
   * Animazione di spawn (bounce)
   */
  spawnAnimation(scene) {
    // Movimento random iniziale
    const angle = Math.random() * Math.PI * 2;
    const distance = 10 + Math.random() * 15;
    const targetX = this.x + Math.cos(angle) * distance;
    const targetY = this.y + Math.sin(angle) * distance;

    scene.tweens.add({
      targets: this,
      x: targetX,
      y: targetY - 10,
      duration: 200,
      ease: 'Power2',
      yoyo: true,
      onComplete: () => {
        // Effetto shimmer
        this.startShimmer(scene);
      }
    });
  }

  /**
   * Effetto luccichio
   */
  startShimmer(scene) {
    scene.tweens.add({
      targets: this,
      alpha: { from: 1, to: 0.7 },
      scale: { from: 1, to: 1.2 },
      duration: 500,
      yoyo: true,
      repeat: -1
    });
  }

  /**
   * Fade out prima di scomparire
   */
  fadeOut(scene) {
    scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 0,
      duration: 300,
      onComplete: () => this.destroy()
    });
  }

  /**
   * Update - gestisce effetto magnete
   */
  update(player, magnetActive = false, magnetRange = 50) {
    if (!this.active || !player) return;

    if (magnetActive) {
      const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);

      if (distance < magnetRange) {
        // Attira verso il player
        this.scene.physics.moveToObject(this, player, 150);
      }
    }
  }

  /**
   * Chiamato quando viene raccolta
   */
  collect() {
    // Effetto raccolta
    if (this.scene) {
      // Particelle dorate
      for (let i = 0; i < 5; i++) {
        const particle = this.scene.add.circle(
          this.x + (Math.random() - 0.5) * 8,
          this.y + (Math.random() - 0.5) * 8,
          2,
          0xffd700
        );
        particle.setDepth(15);

        this.scene.tweens.add({
          targets: particle,
          y: particle.y - 15,
          alpha: 0,
          duration: 300,
          onComplete: () => particle.destroy()
        });
      }
    }

    this.destroy();
    return this.value;
  }
}

/**
 * Factory per creare monete con valori diversi
 */
export function createCoin(scene, x, y, enemyType = 'default') {
  const coinValues = {
    slime: 1,
    goblin: 2,
    fly: 1,
    tank: 5,
    speed: 2,
    ranged: 3,
    assassin: 4,
    boss: 50,
    default: 1
  };

  const value = coinValues[enemyType] || coinValues.default;

  // Chance di droppare monete extra
  const coinCount = Math.random() < 0.1 ? 2 : 1; // 10% chance per doppia moneta

  const coins = [];
  for (let i = 0; i < coinCount; i++) {
    coins.push(new Coin(scene, x + (i * 5), y, value));
  }

  return coins;
}
