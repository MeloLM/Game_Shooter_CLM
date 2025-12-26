/**
 * HUD Scene - UI Overlay
 * Displays score, health, wave info
 * Runs in parallel with Level scene
 */
export default class HUD extends Phaser.Scene {
  constructor() {
    super({ key: 'HUD' });
  }

  create() {
    this.createUIElements();
    this.setupEventListeners();
  }

  createUIElements() {
    // Create score text
    // Create health bar
    // Create wave indicator
  }

  setupEventListeners() {
    // Listen to SCORE_CHANGED
    // Listen to HEALTH_CHANGED
    // Listen to WAVE_CHANGED
    
    const levelScene = this.scene.get('Level');
    
    levelScene.events.on('SCORE_CHANGED', this.updateScore, this);
    levelScene.events.on('HEALTH_CHANGED', this.updateHealth, this);
    levelScene.events.on('WAVE_CHANGED', this.updateWave, this);
  }

  updateScore(newScore) {
    // Update score display
  }

  updateHealth(health, maxHealth) {
    // Update health bar
  }

  updateWave(waveNumber) {
    // Update wave text
  }

  shutdown() {
    const levelScene = this.scene.get('Level');
    levelScene.events.off('SCORE_CHANGED', this.updateScore, this);
    levelScene.events.off('HEALTH_CHANGED', this.updateHealth, this);
    levelScene.events.off('WAVE_CHANGED', this.updateWave, this);
  }
}
