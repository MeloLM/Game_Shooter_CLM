/**
 * GameConfig - Balancing and Wave Configuration
 * Modify these values to balance the game
 */

// Wave Configuration
export const WAVES = [
  {
    wave: 1,
    enemies: 5,
    types: ['Slime'],
    spawnDelay: 2000
  },
  {
    wave: 2,
    enemies: 8,
    types: ['Slime', 'Goblin'],
    spawnDelay: 1800
  },
  {
    wave: 3,
    enemies: 10,
    types: ['Slime', 'Goblin', 'SkeletonKnight'],
    spawnDelay: 1500
  },
  {
    wave: 4,
    enemies: 12,
    types: ['Goblin', 'SkeletonKnight', 'Fly'],
    spawnDelay: 1500
  },
  {
    wave: 5,
    enemies: 1,
    types: ['GiantGoblin'], // Boss wave
    bossWave: true,
    spawnDelay: 0
  }
];

// Difficulty Multipliers
export const DIFFICULTY = {
  EASY: {
    enemyHealth: 0.7,
    enemyDamage: 0.7,
    enemySpeed: 0.8,
    playerDamage: 1.3
  },
  NORMAL: {
    enemyHealth: 1.0,
    enemyDamage: 1.0,
    enemySpeed: 1.0,
    playerDamage: 1.0
  },
  HARD: {
    enemyHealth: 1.5,
    enemyDamage: 1.5,
    enemySpeed: 1.2,
    playerDamage: 0.8
  }
};

// Enemy Type Configurations
export const ENEMY_TYPES = {
  Slime: {
    health: 50,
    speed: 60,
    damage: 5,
    scoreValue: 10,
    texture: 'slime'
  },
  Goblin: {
    health: 80,
    speed: 80,
    damage: 10,
    scoreValue: 20,
    texture: 'goblin'
  },
  SkeletonKnight: {
    health: 120,
    speed: 70,
    damage: 15,
    scoreValue: 30,
    texture: 'skeleton'
  },
  Fly: {
    health: 40,
    speed: 120,
    damage: 5,
    scoreValue: 15,
    texture: 'fly'
  },
  GiantGoblin: {
    health: 500,
    speed: 50,
    damage: 25,
    scoreValue: 100,
    texture: 'giantGoblin',
    isBoss: true
  }
};

// Item Drop Rates (percentage)
export const DROP_RATES = {
  health: 15,
  mana: 10,
  speed: 5,
  damage: 5,
  xp: 20
};

export default {
  WAVES,
  DIFFICULTY,
  ENEMY_TYPES,
  DROP_RATES
};
