/**
 * DamageText - Floating Damage Numbers
 * Shows damage dealt with animation
 */
export default class DamageText {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Show floating damage text
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} damage - Damage amount
   * @param {string} type - 'damage', 'critical', 'heal'
   */
  show(x, y, damage, type = 'damage') {
    let color = '#ffffff';
    let fontSize = '24px';
    
    switch(type) {
      case 'critical':
        color = '#ff0000';
        fontSize = '32px';
        break;
      case 'heal':
        color = '#00ff00';
        break;
      case 'damage':
      default:
        color = '#ffffff';
    }
    
    const text = this.scene.add.text(x, y, Math.floor(damage).toString(), {
      fontFamily: 'Arial',
      fontSize: fontSize,
      color: color,
      stroke: '#000000',
      strokeThickness: 4
    });
    
    text.setOrigin(0.5);
    
    // Animate upward and fade out
    this.scene.tweens.add({
      targets: text,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        text.destroy();
      }
    });
  }
}
