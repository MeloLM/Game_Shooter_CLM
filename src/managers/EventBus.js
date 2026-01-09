/**
 * EventBus - Central Event Management System
 * Sistema centralizzato per la gestione eventi del gioco
 * Permette comunicazione decoupled tra i vari componenti
 */
import { EVENTS } from '../utils/Constants.js';

class EventBus extends Phaser.Events.EventEmitter {
  constructor() {
    super();
    this.debugMode = false;
    this.eventHistory = [];
    this.maxHistorySize = 100;
  }

  /**
   * Abilita/disabilita debug mode per tracciare eventi
   */
  setDebugMode(enabled) {
    this.debugMode = enabled;
    if (enabled) {
      console.log('[EventBus] Debug mode enabled');
    }
  }

  /**
   * Override emit per aggiungere logging in debug mode
   */
  emit(event, ...args) {
    if (this.debugMode) {
      const timestamp = new Date().toISOString();
      console.log(`[EventBus ${timestamp}] Event: ${event}`, args);
      
      // Salva nella history
      this.eventHistory.push({
        event,
        args,
        timestamp
      });
      
      // Limita dimensione history
      if (this.eventHistory.length > this.maxHistorySize) {
        this.eventHistory.shift();
      }
    }
    
    return super.emit(event, ...args);
  }

  /**
   * Ritorna la history degli eventi (utile per debug)
   */
  getEventHistory() {
    return [...this.eventHistory];
  }

  /**
   * Pulisce la history degli eventi
   */
  clearHistory() {
    this.eventHistory = [];
  }

  // === EVENTI PREDEFINITI ===

  /**
   * Emette evento quando un nemico viene ucciso
   */
  emitEnemyKilled(data) {
    this.emit(EVENTS.ENEMY_KILLED, {
      enemyType: data.enemyType || 'unknown',
      scoreValue: data.scoreValue || 10,
      expValue: data.expValue || 10,
      x: data.x || 0,
      y: data.y || 0,
      ...data
    });
  }

  /**
   * Emette evento quando il player subisce danno
   */
  emitPlayerDamaged(data) {
    this.emit(EVENTS.PLAYER_DAMAGED, {
      damage: data.damage || 0,
      currentHP: data.currentHP || 0,
      maxHP: data.maxHP || 100,
      source: data.source || 'unknown',
      ...data
    });
  }

  /**
   * Emette evento quando il player muore
   */
  emitPlayerDied(data) {
    this.emit(EVENTS.PLAYER_DIED, {
      finalScore: data.finalScore || 0,
      survivalTime: data.survivalTime || 0,
      enemiesKilled: data.enemiesKilled || 0,
      ...data
    });
  }

  /**
   * Emette evento quando il player viene curato
   */
  emitPlayerHealed(data) {
    this.emit(EVENTS.PLAYER_HEALED, {
      amount: data.amount || 0,
      currentHP: data.currentHP || 0,
      source: data.source || 'potion',
      ...data
    });
  }

  /**
   * Emette evento quando lo score cambia
   */
  emitScoreChanged(score) {
    this.emit(EVENTS.SCORE_CHANGED, score);
  }

  /**
   * Emette evento di level up
   */
  emitLevelUp(data) {
    this.emit(EVENTS.LEVEL_UP, {
      newLevel: data.newLevel || 1,
      bonusDamage: data.bonusDamage || 0,
      bonusSpeed: data.bonusSpeed || 0,
      bonusHP: data.bonusHP || 0,
      ...data
    });
  }

  /**
   * Emette evento quando inizia una wave
   */
  emitWaveStarted(data) {
    this.emit(EVENTS.WAVE_STARTED, {
      waveNumber: data.waveNumber || 1,
      enemyCount: data.enemyCount || 0,
      isBossWave: data.isBossWave || false,
      ...data
    });
  }

  /**
   * Emette evento quando una wave viene completata
   */
  emitWaveCompleted(data) {
    this.emit(EVENTS.WAVE_COMPLETED, {
      waveNumber: data.waveNumber || 1,
      timeToComplete: data.timeToComplete || 0,
      ...data
    });
  }

  /**
   * Emette evento quando un item viene raccolto
   */
  emitItemCollected(data) {
    this.emit(EVENTS.ITEM_COLLECTED, {
      type: data.type || 'unknown',
      amount: data.amount || 1,
      effect: data.effect || null,
      ...data
    });
  }

  /**
   * Emette evento quando un achievement viene sbloccato
   */
  emitAchievementUnlocked(data) {
    this.emit(EVENTS.ACHIEVEMENT_UNLOCKED, {
      id: data.id || '',
      name: data.name || '',
      description: data.description || '',
      icon: data.icon || '🏆',
      ...data
    });
  }

  /**
   * Emette evento per riprodurre un suono
   */
  emitPlaySFX(soundKey, config = {}) {
    this.emit(EVENTS.PLAY_SFX, {
      key: soundKey,
      volume: config.volume || 1,
      loop: config.loop || false,
      ...config
    });
  }

  /**
   * Emette evento quando viene inferto danno
   */
  emitDamageDealt(data) {
    this.emit(EVENTS.DAMAGE_DEALT, {
      amount: data.amount || 0,
      target: data.target || 'enemy',
      isCritical: data.isCritical || false,
      x: data.x || 0,
      y: data.y || 0,
      ...data
    });
  }

  // === LISTENER HELPERS ===

  /**
   * Registra listener per evento nemico ucciso
   */
  onEnemyKilled(callback, context) {
    this.on(EVENTS.ENEMY_KILLED, callback, context);
  }

  /**
   * Registra listener per danno al player
   */
  onPlayerDamaged(callback, context) {
    this.on(EVENTS.PLAYER_DAMAGED, callback, context);
  }

  /**
   * Registra listener per level up
   */
  onLevelUp(callback, context) {
    this.on(EVENTS.LEVEL_UP, callback, context);
  }

  /**
   * Registra listener per wave started
   */
  onWaveStarted(callback, context) {
    this.on(EVENTS.WAVE_STARTED, callback, context);
  }

  /**
   * Registra listener per wave completed
   */
  onWaveCompleted(callback, context) {
    this.on(EVENTS.WAVE_COMPLETED, callback, context);
  }

  /**
   * Registra listener per achievement unlocked
   */
  onAchievementUnlocked(callback, context) {
    this.on(EVENTS.ACHIEVEMENT_UNLOCKED, callback, context);
  }

  /**
   * Rimuove tutti i listener per un context specifico
   */
  removeAllListenersForContext(context) {
    Object.values(EVENTS).forEach(event => {
      this.off(event, undefined, context);
    });
  }
}

// Singleton instance
const eventBus = new EventBus();
export default eventBus;

