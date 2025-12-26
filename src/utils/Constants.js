/**
 * Constants - Game Configuration Values
 * All hardcoded values and event names
 */

// Player Constants
export const PLAYER = {
  SPEED: 160,
  BASE_HEALTH: 100,
  BASE_DAMAGE: 10
};

// Enemy Constants
export const ENEMY = {
  BASE_HEALTH: 100,
  BASE_SPEED: 80,
  BASE_DAMAGE: 5,
  SCORE_VALUE: 10
};

// World Constants
export const WORLD = {
  WIDTH: 800,
  HEIGHT: 600,
  GRAVITY: 0
};

// Event Names
export const EVENTS = {
  // Player Events
  PLAYER_DAMAGED: 'playerDamaged',
  PLAYER_DIED: 'playerDied',
  PLAYER_HEALED: 'playerHealed',
  
  // Enemy Events
  ENEMY_KILLED: 'enemyKilled',
  ENEMY_SPAWNED: 'enemySpawned',
  ENEMY_DIED: 'enemyDied',
  
  // Game Events
  SCORE_CHANGED: 'scoreChanged',
  HEALTH_CHANGED: 'healthChanged',
  LEVEL_UP: 'levelUp',
  WAVE_STARTED: 'waveStarted',
  WAVE_COMPLETED: 'waveCompleted',
  WAVE_CHANGED: 'waveChanged',
  
  // Item Events
  ITEM_COLLECTED: 'itemCollected',
  
  // Weapon Events
  WEAPON_FIRED: 'weaponFired',
  DAMAGE_DEALT: 'damageDealt',
  
  // Achievement Events
  ACHIEVEMENT_UNLOCKED: 'achievementUnlocked',
  
  // Audio Events
  PLAY_SFX: 'playSFX',
  PLAY_MUSIC: 'playMusic'
};

// Audio Keys
export const AUDIO = {
  MUSIC: {
    MENU: 'menuMusic',
    LEVEL: 'levelMusic',
    BOSS: 'bossMusic'
  },
  SFX: {
    ENEMY_DEATH: 'enemyDeath',
    PLAYER_HIT: 'playerHit',
    WEAPON_FIRE: 'weaponFire',
    ITEM_PICKUP: 'itemPickup',
    LEVEL_UP: 'levelUp'
  }
};

export default {
  PLAYER,
  ENEMY,
  WORLD,
  EVENTS,
  AUDIO
};
