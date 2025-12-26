/**
 * GameManager - Global Game State
 * Manages score, XP, level, difficulty
 * Emits events for UI updates
 */
export default class GameManager {
  constructor(scene) {
    this.scene = scene;
    
    // State
    this.score = 0;
    this.experience = 0;
    this.level = 1;
    this.gameTime = 0;
    this.difficulty = 1.0;
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen to game events
    this.scene.events.on('ENEMY_KILLED', this.onEnemyKilled, this);
    this.scene.events.on('ITEM_COLLECTED', this.onItemCollected, this);
  }

  onEnemyKilled(data) {
    this.addScore(data.scoreValue);
    this.addExperience(data.expValue || 10);
  }

  onItemCollected(data) {
    if (data.type === 'xp') {
      this.addExperience(data.amount);
    }
  }

  addScore(amount) {
    this.score += amount;
    this.scene.events.emit('SCORE_CHANGED', this.score);
  }

  addExperience(amount) {
    this.experience += amount;
    
    const expNeeded = this.level * 100;
    if (this.experience >= expNeeded) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.experience = 0;
    this.scene.events.emit('LEVEL_UP', this.level);
  }

  update(delta) {
    this.gameTime += delta;
  }

  cleanup() {
    this.scene.events.off('ENEMY_KILLED', this.onEnemyKilled, this);
    this.scene.events.off('ITEM_COLLECTED', this.onItemCollected, this);
  }

  getState() {
    return {
      score: this.score,
      level: this.level,
      experience: this.experience,
      gameTime: this.gameTime
    };
  }
}
