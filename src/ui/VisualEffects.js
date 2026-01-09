/**
 * Sistema Effetti Visivi
 * - Trail dietro i proiettili
 * - Particelle alla morte dei nemici
 * - Screen shake dinamico
 * - Altri effetti speciali
 */
export class VisualEffects {
  scene;
  trails = [];
  particles = [];
  particlesEnabled = true;  // Rispetta impostazioni utente
  screenShakeEnabled = true;
  
  constructor(scene) {
    this.scene = scene;
    this.loadSettings();
  }
  
  /**
   * Carica impostazioni particelle da localStorage
   */
  loadSettings() {
    try {
      const saved = localStorage.getItem('knightShooter_settings');
      if (saved) {
        const settings = JSON.parse(saved);
        this.particlesEnabled = settings.particles !== false;
        this.screenShakeEnabled = settings.screenShake !== false;
      }
    } catch (e) {
      this.particlesEnabled = true;
      this.screenShakeEnabled = true;
    }
  }

  // === SCREEN SHAKE SYSTEM ===

  /**
   * Screen shake dinamico basato sull'intensità
   * @param {number} intensity - Intensità (0.001 - 0.05)
   * @param {number} duration - Durata in ms
   */
  screenShake(intensity = 0.01, duration = 100) {
    if (!this.screenShakeEnabled) return;
    
    this.scene.cameras.main.shake(duration, intensity);
  }

  /**
   * Screen shake quando il player subisce danno
   * @param {number} damagePercent - Percentuale HP persi (0-1)
   */
  playerDamageShake(damagePercent) {
    if (!this.screenShakeEnabled) return;
    
    // Più danno = shake più intenso
    const intensity = Math.min(0.003 + (damagePercent * 0.02), 0.025);
    const duration = Math.min(100 + (damagePercent * 200), 300);
    
    this.scene.cameras.main.shake(duration, intensity);
  }

  /**
   * Screen shake quando si uccide un nemico
   * @param {string} enemyType - Tipo di nemico
   */
  enemyKillShake(enemyType = 'default') {
    if (!this.screenShakeEnabled) return;
    
    const shakeConfig = {
      slime: { intensity: 0.002, duration: 50 },
      goblin: { intensity: 0.003, duration: 80 },
      tank: { intensity: 0.008, duration: 150 },
      boss: { intensity: 0.015, duration: 250 },
      default: { intensity: 0.003, duration: 60 }
    };
    
    const config = shakeConfig[enemyType] || shakeConfig.default;
    this.scene.cameras.main.shake(config.duration, config.intensity);
  }

  /**
   * Screen shake per esplosioni
   * @param {number} distance - Distanza dal player
   */
  explosionShake(distance = 0) {
    if (!this.screenShakeEnabled) return;
    
    // Più vicino = shake più forte
    const maxDistance = 200;
    const normalizedDistance = Math.min(distance, maxDistance) / maxDistance;
    const intensity = 0.02 * (1 - normalizedDistance);
    
    if (intensity > 0.002) {
      this.scene.cameras.main.shake(200, intensity);
    }
  }

  /**
   * Screen shake per combo alto
   * @param {number} comboCount - Numero combo attuale
   */
  comboShake(comboCount) {
    if (!this.screenShakeEnabled || comboCount < 5) return;
    
    // Shake leggero per combo alti
    const intensity = Math.min(0.002 + (comboCount * 0.0005), 0.01);
    this.scene.cameras.main.shake(50, intensity);
  }
  
  /**
   * Crea un trail dietro un proiettile
   * @param {Sprite} projectile - Il proiettile da seguire
   * @param {number} color - Colore del trail (hex)
   * @param {number} length - Numero di segmenti del trail
   */
  createTrail(projectile, color = 0xffffff, length = 5) {
    const trail = {
      projectile,
      color,
      segments: [],
      maxLength: length,
      lastPos: { x: projectile.x, y: projectile.y }
    };
    
    this.trails.push(trail);
    return trail;
  }
  
  /**
   * Aggiorna tutti i trail (chiamare ogni frame)
   */
  updateTrails() {
    for (let i = this.trails.length - 1; i >= 0; i--) {
      const trail = this.trails[i];
      
      // Rimuovi trail se il proiettile non esiste più
      if (!trail.projectile || !trail.projectile.active) {
        this.removeTrail(i);
        continue;
      }
      
      // Aggiungi nuovo segmento se il proiettile si è mosso abbastanza
      const dx = trail.projectile.x - trail.lastPos.x;
      const dy = trail.projectile.y - trail.lastPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 3) {
        // Crea nuovo segmento
        const segment = this.scene.add.circle(
          trail.lastPos.x, trail.lastPos.y, 2, trail.color, 0.7
        );
        segment.setDepth(5);
        trail.segments.push(segment);
        
        trail.lastPos = { x: trail.projectile.x, y: trail.projectile.y };
        
        // Limita lunghezza trail
        if (trail.segments.length > trail.maxLength) {
          const oldSegment = trail.segments.shift();
          oldSegment.destroy();
        }
      }
      
      // Fade out dei segmenti
      trail.segments.forEach((seg, idx) => {
        const alpha = (idx + 1) / trail.segments.length * 0.7;
        seg.setAlpha(alpha);
        seg.setScale(alpha);
      });
    }
  }
  
  /**
   * Rimuovi un trail
   */
  removeTrail(index) {
    const trail = this.trails[index];
    trail.segments.forEach(seg => seg.destroy());
    this.trails.splice(index, 1);
  }
  
  /**
   * Crea particelle alla morte di un nemico
   * @param {number} x - Posizione X
   * @param {number} y - Posizione Y
   * @param {string} enemyType - Tipo di nemico per variare colore
   */
  createDeathParticles(x, y, enemyType = 'default') {
    // Skip se particelle disabilitate
    if (!this.particlesEnabled) return;
    // Colori in base al tipo di nemico
    const colors = {
      slime: [0x00ff00, 0x88ff88, 0x44aa44],
      goblin: [0x00aa00, 0x228822, 0x115511],
      fly: [0x888888, 0xaaaaaa, 0x666666],
      tank: [0x8B4513, 0xA0522D, 0x654321],
      speed: [0xff4444, 0xff8888, 0xaa2222],
      ranged: [0x9932CC, 0xBA55D3, 0x663399],
      default: [0xff0000, 0xff4444, 0xaa0000]
    };
    
    const particleColors = colors[enemyType] || colors.default;
    const particleCount = 12;
    
    for (let i = 0; i < particleCount; i++) {
      const color = particleColors[Math.floor(Math.random() * particleColors.length)];
      const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.5;
      const distance = 15 + Math.random() * 20;
      const size = 2 + Math.random() * 3;
      
      const particle = this.scene.add.circle(x, y, size, color);
      particle.setDepth(10);
      
      // Animazione esplosione
      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance - 10, // Leggermente verso l'alto
        alpha: 0,
        scale: 0,
        duration: 300 + Math.random() * 200,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
    
    // Effetto "blood splatter" (cerchi che si espandono)
    for (let i = 0; i < 3; i++) {
      const splatter = this.scene.add.circle(
        x + (Math.random() - 0.5) * 10,
        y + (Math.random() - 0.5) * 10,
        1,
        particleColors[0],
        0.5
      );
      splatter.setDepth(9);
      
      this.scene.tweens.add({
        targets: splatter,
        scale: 3 + Math.random() * 2,
        alpha: 0,
        duration: 400,
        ease: 'Power2',
        onComplete: () => splatter.destroy()
      });
    }
  }
  
  /**
   * Crea effetto impatto quando un proiettile colpisce
   */
  createHitEffect(x, y, color = 0xffffff) {
    // Skip se particelle disabilitate
    if (!this.particlesEnabled) return;
    
    // Scintille
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 8 + Math.random() * 8;
      
      const spark = this.scene.add.circle(x, y, 1.5, color);
      spark.setDepth(15);
      
      this.scene.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        duration: 150,
        onComplete: () => spark.destroy()
      });
    }
    
    // Flash
    const flash = this.scene.add.circle(x, y, 4, 0xffffff, 0.8);
    flash.setDepth(14);
    
    this.scene.tweens.add({
      targets: flash,
      scale: 2,
      alpha: 0,
      duration: 100,
      onComplete: () => flash.destroy()
    });
  }
  
  /**
   * Crea effetto polvere/movimento
   */
  createDustEffect(x, y) {
    // Skip se particelle disabilitate
    if (!this.particlesEnabled) return;
    
    for (let i = 0; i < 3; i++) {
      const dust = this.scene.add.circle(
        x + (Math.random() - 0.5) * 8,
        y + Math.random() * 4,
        2,
        0xcccccc,
        0.4
      );
      dust.setDepth(1);
      
      this.scene.tweens.add({
        targets: dust,
        y: dust.y - 5,
        alpha: 0,
        scale: 0.5,
        duration: 300,
        onComplete: () => dust.destroy()
      });
    }
  }
  
  /**
   * Update da chiamare ogni frame
   */
  update() {
    this.updateTrails();
  }

  // === EFFETTI PARTICELLE AVANZATI ===

  /**
   * Effetto esplosione elaborato per boss
   */
  createBossDeathEffect(x, y) {
    if (!this.particlesEnabled) return;
    
    // Shake potente
    this.screenShake(0.02, 400);
    
    // Onda d'urto
    const shockwave = this.scene.add.circle(x, y, 10, 0xffffff, 0.8);
    shockwave.setDepth(20);
    shockwave.setStrokeStyle(3, 0xffaa00);
    
    this.scene.tweens.add({
      targets: shockwave,
      scale: 8,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => shockwave.destroy()
    });
    
    // Esplosione particelle multicolore
    const colors = [0xff0000, 0xff6600, 0xffcc00, 0xffffff];
    for (let wave = 0; wave < 3; wave++) {
      this.scene.time.delayedCall(wave * 100, () => {
        for (let i = 0; i < 20; i++) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          const angle = (i / 20) * Math.PI * 2 + Math.random() * 0.5;
          const distance = 30 + wave * 20 + Math.random() * 30;
          const size = 3 + Math.random() * 4;
          
          const particle = this.scene.add.circle(x, y, size, color);
          particle.setDepth(15 + wave);
          
          this.scene.tweens.add({
            targets: particle,
            x: x + Math.cos(angle) * distance,
            y: y + Math.sin(angle) * distance - 20,
            alpha: 0,
            scale: 0,
            duration: 400 + Math.random() * 300,
            ease: 'Power2',
            onComplete: () => particle.destroy()
          });
        }
      });
    }
    
    // Flash screen
    this.createFlashOverlay(0xffffff, 0.5, 200);
  }

  /**
   * Crea effetto flash su schermo
   */
  createFlashOverlay(color = 0xffffff, alpha = 0.5, duration = 100) {
    const flash = this.scene.add.rectangle(
      this.scene.cameras.main.scrollX + 320,
      this.scene.cameras.main.scrollY + 180,
      640, 360,
      color, alpha
    );
    flash.setScrollFactor(0);
    flash.setDepth(200);
    
    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration: duration,
      onComplete: () => flash.destroy()
    });
  }

  /**
   * Effetto raccolta pozione
   */
  createPotionCollectEffect(x, y, color = 0x00ff00) {
    if (!this.particlesEnabled) return;
    
    // Scintille che salgono
    for (let i = 0; i < 8; i++) {
      const sparkle = this.scene.add.circle(
        x + (Math.random() - 0.5) * 10,
        y,
        2,
        color
      );
      sparkle.setDepth(15);
      
      this.scene.tweens.add({
        targets: sparkle,
        y: sparkle.y - 20 - Math.random() * 15,
        x: sparkle.x + (Math.random() - 0.5) * 20,
        alpha: 0,
        scale: 0,
        duration: 400 + Math.random() * 200,
        ease: 'Power1',
        onComplete: () => sparkle.destroy()
      });
    }
    
    // Cerchio che si espande
    const ring = this.scene.add.circle(x, y, 5, color, 0);
    ring.setStrokeStyle(2, color, 0.8);
    ring.setDepth(14);
    
    this.scene.tweens.add({
      targets: ring,
      scale: 3,
      alpha: 0,
      duration: 300,
      onComplete: () => ring.destroy()
    });
  }

  /**
   * Effetto level up elaborato
   */
  createLevelUpEffect(x, y) {
    if (!this.particlesEnabled) return;
    
    // Shake celebrativo
    this.screenShake(0.008, 200);
    
    // Anello dorato che si espande
    for (let i = 0; i < 3; i++) {
      this.scene.time.delayedCall(i * 100, () => {
        const ring = this.scene.add.circle(x, y, 10, 0xffd700, 0);
        ring.setStrokeStyle(2 - i * 0.5, 0xffd700, 0.8);
        ring.setDepth(50);
        
        this.scene.tweens.add({
          targets: ring,
          scale: 4 + i,
          alpha: 0,
          duration: 600,
          ease: 'Power2',
          onComplete: () => ring.destroy()
        });
      });
    }
    
    // Stelle dorate
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const star = this.scene.add.text(x, y, '★', {
        fontSize: '12px',
        color: '#ffd700'
      });
      star.setOrigin(0.5);
      star.setDepth(51);
      
      this.scene.tweens.add({
        targets: star,
        x: x + Math.cos(angle) * 50,
        y: y + Math.sin(angle) * 50,
        alpha: 0,
        rotation: Math.PI,
        duration: 800,
        ease: 'Power2',
        onComplete: () => star.destroy()
      });
    }
  }

  /**
   * Effetto critico
   */
  createCriticalEffect(x, y) {
    if (!this.particlesEnabled) return;
    
    // Shake veloce
    this.screenShake(0.005, 80);
    
    // X rossa
    const critText = this.scene.add.text(x, y - 10, '✕', {
      fontSize: '20px',
      color: '#ff0000',
      fontStyle: 'bold'
    });
    critText.setOrigin(0.5);
    critText.setDepth(100);
    
    this.scene.tweens.add({
      targets: critText,
      y: critText.y - 20,
      scale: 1.5,
      alpha: 0,
      duration: 400,
      onComplete: () => critText.destroy()
    });
    
    // Scintille rosse
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spark = this.scene.add.circle(x, y, 2, 0xff0000);
      spark.setDepth(99);
      
      this.scene.tweens.add({
        targets: spark,
        x: x + Math.cos(angle) * 15,
        y: y + Math.sin(angle) * 15,
        alpha: 0,
        duration: 200,
        onComplete: () => spark.destroy()
      });
    }
  }
  
  /**
   * Pulisci tutti gli effetti
   */
  destroy() {
    this.trails.forEach((trail, i) => this.removeTrail(i));
  }
}
