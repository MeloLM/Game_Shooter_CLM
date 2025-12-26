/**
 * Sistema Effetti Visivi
 * - Trail dietro i proiettili
 * - Particelle alla morte dei nemici
 * - Altri effetti speciali
 */
export class VisualEffects {
  scene;
  trails = [];
  particles = [];
  particlesEnabled = true;  // Rispetta impostazioni utente
  
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
      }
    } catch (e) {
      this.particlesEnabled = true;
    }
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
  
  /**
   * Pulisci tutti gli effetti
   */
  destroy() {
    this.trails.forEach((trail, i) => this.removeTrail(i));
  }
}
