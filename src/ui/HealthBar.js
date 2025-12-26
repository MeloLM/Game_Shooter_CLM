/**
 * HealthBar - Visual Health Display Component
 * Reusable health bar for player and enemies
 */
export default class HealthBar {
  constructor(scene, x, y, width = 100, height = 10) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.maxHealth = 100;
    this.currentHealth = 100;
    
    this.createBar();
  }

  createBar() {
    // Background (red)
    this.bg = this.scene.add.graphics();
    this.bg.fillStyle(0xff0000, 1);
    this.bg.fillRect(this.x, this.y, this.width, this.height);
    
    // Foreground (green)
    this.bar = this.scene.add.graphics();
    this.updateDisplay();
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.bg.clear();
    this.bg.fillStyle(0xff0000, 1);
    this.bg.fillRect(this.x, this.y, this.width, this.height);
    this.updateDisplay();
  }

  setMaxHealth(max) {
    this.maxHealth = max;
    this.currentHealth = Math.min(this.currentHealth, max);
    this.updateDisplay();
  }

  updateDisplay(health = this.currentHealth) {
    this.currentHealth = health;
    
    this.bar.clear();
    this.bar.fillStyle(0x00ff00, 1);
    
    const healthPercent = this.currentHealth / this.maxHealth;
    const barWidth = this.width * healthPercent;
    
    this.bar.fillRect(this.x, this.y, barWidth, this.height);
  }

  destroy() {
    this.bg.destroy();
    this.bar.destroy();
  }
}
