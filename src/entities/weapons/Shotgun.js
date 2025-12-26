import { Physics } from "phaser";

/**
 * Shotgun - Spara 3 proiettili a ventaglio
 */
export class Shotgun extends Physics.Arcade.Sprite {
  speed = 150;
  
  constructor(pointer, scene, x, y, angle, texture = "sword") {
    super(scene, x, y, texture);
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Calcola velocità dal centro
    const velocityX = Math.cos(angle) * this.speed;
    const velocityY = Math.sin(angle) * this.speed;
    
    this.setVelocity(velocityX, velocityY);
    this.body.setSize(8, 8);
    this.rotation = angle;
    this.setTint(0xffaa00); // Arancione
    this.setScale(0.8);
    
    // Auto-distruzione
    scene.time.addEvent({
      delay: 1500,
      callback: () => {
        scene.attacks = scene.attacks.filter(a => a !== this);
        this.destroy();
      }
    });
    
    if (!scene.anims.exists("shotgun_shot")) {
      scene.anims.create({
        key: "shotgun_shot",
        repeat: -1,
        frameRate: 6,
        frames: scene.anims.generateFrameNumbers(texture, {
          start: 0,
          end: 2,
        })
      });
    }
    
    this.play("shotgun_shot");
  }
  
  /**
   * Crea i 3 proiettili del shotgun
   * @returns {Array} Array di proiettili
   */
  static createSpread(pointer, scene, x, y, angle) {
    const projectiles = [];
    const spreadAngle = 0.3; // ~17 gradi
    
    // Proiettile centrale
    projectiles.push(new Shotgun(pointer, scene, x, y, angle));
    
    // Proiettile sinistro
    projectiles.push(new Shotgun(pointer, scene, x, y, angle - spreadAngle));
    
    // Proiettile destro
    projectiles.push(new Shotgun(pointer, scene, x, y, angle + spreadAngle));
    
    return projectiles;
  }
}
