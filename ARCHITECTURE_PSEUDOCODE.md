# 🧠 KNIGHT SHOOTER - ARCHITECTURE PSEUDOCODE

> **File:** `ARCHITECTURE_PSEUDOCODE.md`
> **Scopo:** Rappresentazione in pseudocode dell'architettura del progetto per navigazione rapida AI
> **Data:** 2025-12-26

---

## 📋 PATTERN ARCHITETTURALE: EVENT-DRIVEN MODULAR SYSTEM

```pseudocode
ARCHITECTURE_PATTERN = {
  type: "Event-Driven Modular",
  core_principle: "Separation of Concerns (SoC)",
  communication: "Event Bus Pattern",
  composition: "Managers as Components"
}

RULES = {
  BAD: "DirectCoupling(Entity -> UI)",
  GOOD: "Entity -> Event -> Manager -> Event -> UI"
}
```

---

## 🗂️ DIRECTORY STRUCTURE PSEUDOCODE

```pseudocode
PROJECT_ROOT = "src/"

STRUCTURE = {
  
  // 🎬 SCENES - Entry points e orchestrazione
  scenes: {
    path: "src/scenes/",
    responsibility: "Scene lifecycle (create/update)",
    files: {
      Boot.js: {
        purpose: "Preload global assets",
        methods: [preload(), create()],
        loads: ["textures", "audio", "fonts"]
      },
      
      MainMenu.js: {
        purpose: "Menu principale",
        methods: [create(), handleInput()],
        transitions_to: ["Level"]
      },
      
      Level.js: {
        purpose: "Gameplay orchestrator",
        methods: [create(), update(), cleanup()],
        manages: [
          "WaveManager",
          "GameManager",
          "CollisionManager"
        ],
        contains: ["Player", "Enemies[]", "Map"]
      },
      
      HUD.js: {
        purpose: "UI overlay scene",
        methods: [create(), updateDisplay()],
        listens_to: [
          "SCORE_CHANGED",
          "HEALTH_CHANGED",
          "WAVE_CHANGED"
        ]
      },
      
      GameOver.js: {
        purpose: "End screen",
        methods: [create(), showStats()],
        displays: ["finalScore", "achievements", "time"]
      }
    }
  },
  
  // 👾 ENTITIES - Physical game objects
  entities: {
    path: "src/entities/",
    responsibility: "Internal logic (movement, animation)",
    
    Player.js: {
      extends: "Phaser.Physics.Arcade.Sprite",
      properties: [
        "health", "speed", "damage", "currentWeapon"
      ],
      methods: [
        "update()",
        "takeDamage(amount)",
        "heal(amount)",
        "equipWeapon(weapon)",
        "move(direction)",
        "attack()"
      ],
      emits: [
        "PLAYER_DAMAGED",
        "PLAYER_DIED",
        "ENEMY_KILLED",
        "WEAPON_FIRED"
      ]
    },
    
    enemies: {
      path: "src/entities/enemies/",
      
      Enemy.js: {
        purpose: "Base class for all enemies",
        extends: "Phaser.Physics.Arcade.Sprite",
        properties: [
          "health", "speed", "damage", "scoreValue"
        ],
        methods: [
          "update(player)",
          "takeDamage(amount)",
          "die()",
          "chasePlayer(player)",
          "attack()"
        ],
        emits: ["ENEMY_DIED", "ENEMY_SPAWNED"]
      },
      
      specialized: [
        "Goblin.js",
        "Slime.js",
        "SlimeRed.js",
        "SlimeBlue.js",
        "SlimeGreen.js",
        "SkeletonKnight.js",
        "Fly.js",
        "RangedEnemy.js",
        "SpeedEnemy.js",
        "TankEnemy.js"
      ],
      
      bosses: {
        path: "src/entities/enemies/bosses/",
        files: [
          "GiantGoblin.js",
          "OrcBoss.js"
        ]
      }
    },
    
    weapons: {
      path: "src/entities/weapons/",
      files: [
        "Sword.js",
        "Boomerang.js",
        "Beam.js",
        "Thunder.js",
        "Shotgun.js",
        "Shield.js"
      ],
      base_interface: {
        methods: [
          "fire(direction)",
          "update()",
          "onHit(target)"
        ]
      }
    },
    
    items: {
      path: "src/entities/items/",
      files: [
        "Bottle.js",           // Base class
        "RedBottle.js",        // Health
        "BlueBottle.js",       // Mana
        "GreenBottle.js",      // Speed
        "YellowBottle.js",     // Damage
        "PurpleBottle.js",     // Shield
        "OrangeBottle.js",     // XP
        "CyanBottle.js"        // Rare
      ],
      base_interface: {
        methods: [
          "collect(player)",
          "applyEffect(player)"
        ]
      }
    }
  },
  
  // 🧠 MANAGERS - Pure logic (Brain)
  managers: {
    path: "src/managers/",
    responsibility: "Game logic without visual representation",
    
    WaveManager.js: {
      purpose: "Enemy spawning orchestration",
      properties: [
        "currentWave",
        "enemiesRemaining",
        "spawnPoints[]",
        "waveConfig"
      ],
      methods: [
        "startWave(waveNumber)",
        "spawnEnemy(type, position)",
        "checkWaveComplete()",
        "getNextWaveData()"
      ],
      emits: [
        "WAVE_STARTED",
        "WAVE_COMPLETED",
        "ENEMY_SPAWNED",
        "ALL_WAVES_CLEARED"
      ],
      listens_to: ["ENEMY_DIED"]
    },
    
    GameManager.js: {
      purpose: "Global game state management",
      properties: [
        "score",
        "experience",
        "level",
        "gameTime",
        "difficulty"
      ],
      methods: [
        "addScore(amount)",
        "addExperience(amount)",
        "levelUp()",
        "saveGameState()",
        "loadGameState()"
      ],
      emits: [
        "SCORE_CHANGED",
        "LEVEL_UP",
        "GAME_PAUSED",
        "GAME_OVER"
      ],
      listens_to: [
        "ENEMY_KILLED",
        "PLAYER_DIED",
        "ITEM_COLLECTED"
      ]
    },
    
    AudioManager.js: {
      purpose: "Centralized audio control",
      properties: [
        "music",
        "sfx{}",
        "volume",
        "muted"
      ],
      methods: [
        "playMusic(key)",
        "playSFX(key)",
        "stopAll()",
        "setVolume(volume)",
        "toggleMute()"
      ],
      listens_to: [
        "WEAPON_FIRED",
        "ENEMY_DIED",
        "PLAYER_DAMAGED",
        "ITEM_COLLECTED"
      ]
    },
    
    AchievementSystem.js: {
      purpose: "Track and unlock achievements",
      properties: [
        "achievements{}",
        "unlockedAchievements[]"
      ],
      methods: [
        "checkAchievements()",
        "unlockAchievement(id)",
        "getProgress(id)"
      ],
      emits: ["ACHIEVEMENT_UNLOCKED"],
      listens_to: [
        "ENEMY_KILLED",
        "WAVE_COMPLETED",
        "LEVEL_UP"
      ]
    },
    
    EventBus.js: {
      purpose: "Central event hub (optional)",
      note: "Can use scene.events instead",
      methods: [
        "emit(eventName, data)",
        "on(eventName, callback)",
        "off(eventName, callback)",
        "once(eventName, callback)"
      ]
    }
  },
  
  // 🎨 UI - Reusable UI components
  ui: {
    path: "src/ui/",
    responsibility: "Visual UI elements (decoupled from logic)",
    
    HealthBar.js: {
      purpose: "Visual health representation",
      properties: [
        "currentHealth",
        "maxHealth",
        "barGraphics"
      ],
      methods: [
        "create(x, y)",
        "updateDisplay(health)",
        "setMaxHealth(max)"
      ],
      listens_to: ["HEALTH_CHANGED"]
    },
    
    DamageText.js: {
      purpose: "Floating damage numbers",
      methods: [
        "show(x, y, damage, type)",
        "animate()",
        "destroy()"
      ],
      listens_to: ["DAMAGE_DEALT"]
    },
    
    Minimap.js: {
      purpose: "Real-time minimap",
      properties: [
        "camera",
        "playerMarker",
        "enemyMarkers[]"
      ],
      methods: [
        "create()",
        "updatePositions()",
        "render()"
      ],
      updates_on: "scene.update"
    }
  },
  
  // 🛠️ UTILS - Helper functions
  utils: {
    path: "src/utils/",
    responsibility: "Reusable pure functions and constants",
    
    Constants.js: {
      purpose: "Hardcoded game values",
      exports: {
        PLAYER_SPEED: 160,
        ENEMY_BASE_HEALTH: 100,
        GRAVITY: 0,
        SCREEN_WIDTH: 800,
        SCREEN_HEIGHT: 600,
        EVENTS: {
          ENEMY_KILLED: "enemyKilled",
          PLAYER_DAMAGED: "playerDamaged",
          SCORE_CHANGED: "scoreChanged"
          // ... all event names
        }
      }
    },
    
    GameConfig.js: {
      purpose: "Balancing configurations",
      exports: {
        WAVES: [
          {wave: 1, enemies: 5, types: ["Slime"]},
          {wave: 2, enemies: 8, types: ["Slime", "Goblin"]},
          // ...
        ],
        DIFFICULTY_MULTIPLIERS: {
          EASY: 0.7,
          NORMAL: 1.0,
          HARD: 1.5
        }
      }
    },
    
    MathHelpers.js: {
      purpose: "Math utility functions",
      exports: {
        functions: [
          "getDistance(obj1, obj2)",
          "getAngle(obj1, obj2)",
          "randomRange(min, max)",
          "clamp(value, min, max)"
        ]
      }
    }
  }
}
```

---

## 🔄 EVENT FLOW PSEUDOCODE

```pseudocode
// Example: Player kills enemy
FLOW_ENEMY_DEATH = {
  
  step_1: {
    trigger: "Enemy.health <= 0",
    action: "Enemy.die()",
    emits: "ENEMY_KILLED",
    data: {enemyType, position, scoreValue}
  },
  
  step_2: {
    listener: "WaveManager",
    action: "decrementEnemiesRemaining()",
    checks: "if (enemiesRemaining == 0)",
    emits: "WAVE_COMPLETED"
  },
  
  step_3: {
    listener: "GameManager",
    action: "addScore(scoreValue)",
    emits: "SCORE_CHANGED",
    data: {newScore, scoreDelta}
  },
  
  step_4: {
    listener: "HUD",
    action: "updateScoreDisplay(newScore)",
    visual: "scoreText.setText(newScore)"
  },
  
  step_5: {
    listener: "AudioManager",
    action: "playSFX('enemy_death')"
  },
  
  step_6: {
    listener: "AchievementSystem",
    action: "checkAchievements('kills')",
    might_emit: "ACHIEVEMENT_UNLOCKED"
  }
}

// No direct coupling: Enemy ❌ ScoreText
// Only event coupling: Enemy -> Event -> Manager -> Event -> UI ✅
```

---

## 🏗️ MIGRATION STRATEGY PSEUDOCODE

```pseudocode
CURRENT_STATE = {
  problem: "Everything in Level.js (monolithic)",
  size: "~2000 lines",
  coupling: "High"
}

TARGET_STATE = {
  structure: "Modular with clear boundaries",
  level_js_size: "~300 lines (orchestrator only)",
  coupling: "Low (event-based)"
}

MIGRATION_STEPS = [
  {
    step: 1,
    action: "Create new directory structure",
    creates: ["scenes/", "entities/", "managers/", "ui/", "utils/"]
  },
  {
    step: 2,
    action: "Extract Managers from Level.js",
    moves: ["WaveManager", "GameManager", "AudioManager"]
  },
  {
    step: 3,
    action: "Move Entities to entities/ folder",
    moves: ["Player", "Enemy", "All enemy types", "Weapons", "Items"]
  },
  {
    step: 4,
    action: "Create UI components",
    creates: ["HealthBar", "DamageText", "Minimap"]
  },
  {
    step: 5,
    action: "Extract constants and configs",
    creates: ["Constants.js", "GameConfig.js", "MathHelpers.js"]
  },
  {
    step: 6,
    action: "Refactor communication to events",
    replaces: "Direct calls -> Event emissions"
  },
  {
    step: 7,
    action: "Test and validate",
    ensures: "All features still work"
  }
]
```

---

## 📦 FILE TEMPLATE PSEUDOCODE

```pseudocode
// Template for Manager
CLASS Manager {
  CONSTRUCTOR(scene) {
    this.scene = scene
    this.setupEventListeners()
  }
  
  METHOD setupEventListeners() {
    scene.events.on(EVENT_NAME, this.handler, this)
  }
  
  METHOD handler(data) {
    // Process data
    // Update internal state
    // Emit new event if needed
    this.scene.events.emit(NEW_EVENT, result)
  }
  
  METHOD cleanup() {
    scene.events.off(EVENT_NAME, this.handler, this)
  }
}

// Template for Entity
CLASS Entity EXTENDS Phaser.Sprite {
  CONSTRUCTOR(scene, x, y, texture) {
    super(scene, x, y, texture)
    this.initProperties()
  }
  
  METHOD update() {
    // Only update self
    // Don't touch UI or other systems
  }
  
  METHOD onEvent() {
    // React to game events
    // Emit events when state changes
    this.scene.events.emit(EVENT_NAME, data)
  }
}

// Template for UI Component
CLASS UIComponent {
  CONSTRUCTOR(scene) {
    this.scene = scene
    this.createVisuals()
    this.listenToEvents()
  }
  
  METHOD createVisuals() {
    // Create Phaser objects
  }
  
  METHOD listenToEvents() {
    scene.events.on(EVENT_NAME, this.updateDisplay, this)
  }
  
  METHOD updateDisplay(data) {
    // Only update visuals
    // No game logic here
  }
}
```

---

## 🎯 QUICK REFERENCE FOR AI

```pseudocode
WHEN_WORKING_ON = {
  
  "Adding new enemy": {
    location: "src/entities/enemies/",
    extends: "Enemy.js",
    must_emit: ["ENEMY_DIED", "ENEMY_SPAWNED"],
    register_in: "WaveManager.js enemy types"
  },
  
  "Adding new weapon": {
    location: "src/entities/weapons/",
    interface: {fire(), update(), onHit()},
    register_in: "Player.js weapons array"
  },
  
  "Modifying score logic": {
    file: "src/managers/GameManager.js",
    method: "addScore()",
    emits: "SCORE_CHANGED",
    dont_touch: "UI files directly"
  },
  
  "Changing UI": {
    location: "src/ui/",
    only_change: "Visual representation",
    listen_to: "Events from managers",
    dont_add: "Game logic"
  },
  
  "Adding new wave": {
    file: "src/utils/GameConfig.js",
    array: "WAVES[]",
    format: {wave, enemies, types, bossType?}
  }
}

DEBUGGING = {
  "UI not updating": "Check event listeners in UI component",
  "Enemy not spawning": "Check WaveManager.spawnEnemy() and GameConfig",
  "Score wrong": "Check GameManager.addScore() and event flow",
  "Audio not playing": "Check AudioManager listeners and event names"
}
```

---

## ✅ VERIFICATION CHECKLIST

```pseudocode
ARCHITECTURE_IS_CORRECT_IF = {
  
  ✅ "Level.js is < 500 lines": true,
  ✅ "No direct UI manipulation in entities": true,
  ✅ "All communication via events": true,
  ✅ "Managers are scene-independent": true,
  ✅ "UI components only listen, never emit game logic": true,
  ✅ "Constants in Constants.js, not hardcoded": true,
  ✅ "Each file has single responsibility": true,
  ✅ "No circular dependencies": true
}
```

---

**Fine del documento pseudocode. Usare come mappa mentale per navigare e modificare il progetto.**
