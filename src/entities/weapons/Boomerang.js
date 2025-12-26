import { Physics } from "phaser";

/**
 * Boomerang - Proiettile che torna indietro
 */
export class Boomerang extends Physics.Arcade.Sprite {
  speed = 180;
  returnSpeed = 150;
  maxDistance = 150;
  startX;
  startY;
  returning = false;
  playerRef;
  hasHit = new Set(); // Traccia nemici già colpiti (per evitare doppio danno)
  
  constructor(pointer, scene, x, y, angle, texture = "sword") {
    super(scene, x, y, texture);
    
    this.startX = x;
    this.startY = y;
    this.playerRef = scene.player;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Calcola direzione iniziale
    const velocityX = Math.cos(angle) * this.speed;
    const velocityY = Math.sin(angle) * this.speed;
    
    this.setVelocity(velocityX, velocityY);
    this.body.setSize(12, 12);
    this.rotation = angle;
    this.setTint(0x00ffff); // Cyan
    
    // Auto-distruzione dopo molto tempo (sicurezza)
    scene.time.addEvent({
      delay: 10000,
      callback: () => {
        scene.attacks = scene.attacks.filter(a => a !== this);
        this.destroy();
      }
    });
    
    if (!scene.anims.exists("boomerang_spin")) {
      scene.anims.create({
        key: "boomerang_spin",
        repeat: -1,
        frameRate: 12,
        frames: scene.anims.generateFrameNumbers(texture, {
          start: 0,
          end: 2,
        })
      });
    }
    
    this.play("boomerang_spin");
  }
  
  /**
   * Update del boomerang - chiamato ogni frame
   */
  update() {
    if (!this.active || !this.scene) return;
    
    // Rotazione continua
    this.rotation += 0.3;
    
    // Calcola distanza dal punto di partenza
    const distance = Phaser.Math.Distance.Between(
      this.x, this.y,
      this.startX, this.startY
    );
    
    // Se ha raggiunto la distanza massima, inizia a tornare
    if (!this.returning && distance >= this.maxDistance) {
      this.returning = true;
      this.hasHit.clear(); // Reset nemici colpiti per il ritorno
    }
    
    // Se sta tornando, muoviti verso il player
    if (this.returning && this.playerRef) {
      const angle = Phaser.Math.Angle.Between(
        this.x, this.y,
        this.playerRef.x, this.playerRef.y
      );
      
      this.setVelocity(
        Math.cos(angle) * this.returnSpeed,
        Math.sin(angle) * this.returnSpeed
      );
      
      // Se torna vicino al player, distruggi
      const distToPlayer = Phaser.Math.Distance.Between(
        this.x, this.y,
        this.playerRef.x, this.playerRef.y
      );
      
      if (distToPlayer < 15) {
        this.scene.attacks = this.scene.attacks.filter(a => a !== this);
        this.destroy();
      }
    }
  }
  
  /**
   * Controlla se può colpire un nemico (evita doppi danni)
   */
  canHit(enemy) {
    if (this.hasHit.has(enemy)) {
      return false;
    }
    this.hasHit.add(enemy);
    return true;
  }
}
