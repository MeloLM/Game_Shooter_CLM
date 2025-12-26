# 🗺️ PROJECT MAP - NAVIGAZIONE RAPIDA AI

> **Scopo:** Mappa concettuale per navigazione istantanea del progetto
> **Uso:** Consultare prima di ogni modifica per trovare il file corretto

---

## 🎯 QUICK LOOKUP TABLE

```pseudocode
FIND_FILE = {
  
  // === VOGLIO MODIFICARE... ===
  
  "menu principale":     "src/scenes/MainMenu.js",
  "gameplay":            "src/scenes/Level.js",
  "game over":           "src/scenes/GameOver.js",
  "trofei":              "src/scenes/TrophyScreen.js",
  "impostazioni":        "src/scenes/Settings.js",
  "HUD/overlay":         "src/scenes/HUD.js",
  
  "player/giocatore":    "src/entities/Player.js",
  "nemico base":         "src/entities/enemies/Enemy.js",
  "goblin":              "src/entities/enemies/Goblin.js",
  "slime verde":         "src/entities/enemies/SlimeGreen.js",
  "slime blu":           "src/entities/enemies/SlimeBlue.js",
  "slime rosso":         "src/entities/enemies/SlimeRed.js",
  "mosca/fly":           "src/entities/enemies/Fly.js",
  "tank enemy":          "src/entities/enemies/TankEnemy.js",
  "speed enemy":         "src/entities/enemies/SpeedEnemy.js",
  "ranged enemy":        "src/entities/enemies/RangedEnemy.js",
  "skeleton":            "src/entities/enemies/SkeletonKnight.js",
  "boss goblin":         "src/entities/enemies/bosses/GiantGoblin.js",
  "boss orc":            "src/entities/enemies/bosses/OrcBoss.js",
  
  "spada":               "src/entities/weapons/Sword.js",
  "laser/beam":          "src/entities/weapons/Beam.js",
  "boomerang":           "src/entities/weapons/Boomerang.js",
  "shotgun":             "src/entities/weapons/Shotgun.js",
  "scudo":               "src/entities/weapons/Shield.js",
  "fulmine/thunder":     "src/entities/weapons/Thunder.js",
  
  "pozione rossa/heal":  "src/entities/items/RedBottle.js",
  "pozione blu/shield":  "src/entities/items/BlueBottle.js",
  "pozione verde/speed": "src/entities/items/GreenBottle.js",
  "pozione gialla/laser":"src/entities/items/YellowBottle.js",
  "pozione viola/thunder":"src/entities/items/PurpleBottle.js",
  "pozione arancio/shotgun":"src/entities/items/OrangeBottle.js",
  "pozione cyan/boomerang":"src/entities/items/CyanBottle.js",
  "porta/door":          "src/entities/items/Door.js",
  
  "wave/ondate":         "src/managers/WaveManager.js",
  "punteggio/score":     "src/managers/GameManager.js",
  "audio/suoni":         "src/managers/AudioManager.js",
  "achievement/trofei":  "src/managers/AchievementSystem.js",
  "difficoltà":          "src/managers/DifficultyManager.js",
  "combo":               "src/managers/ComboSystem.js",
  "eventi globali":      "src/managers/EventBus.js",
  
  "minimap":             "src/ui/Minimap.js",
  "controlli mobile":    "src/ui/MobileControls.js",
  "effetti visivi":      "src/ui/VisualEffects.js",
  "barra salute":        "src/ui/HealthBar.js",
  "numeri danno":        "src/ui/DamageText.js",
  
  "costanti":            "src/utils/Constants.js",
  "config wave":         "src/utils/GameConfig.js",
  "funzioni math":       "src/utils/MathHelpers.js",
  
  "entry point":         "main.js",
  "html":                "index.html",
  "stili":               "style.css"
}
```

---

## 📊 DEPENDENCY GRAPH

```pseudocode
DEPENDENCIES = {
  
  // main.js importa
  "main.js": [
    "scenes/Level",
    "scenes/MainMenu", 
    "scenes/GameOver",
    "scenes/TrophyScreen",
    "scenes/Settings"
  ],
  
  // Level.js importa (CORE)
  "scenes/Level.js": [
    "entities/Player",
    "entities/enemies/*",
    "entities/enemies/bosses/*",
    "entities/items/*",
    "entities/weapons/Shield",
    "entities/weapons/Thunder",
    "entities/weapons/Boomerang",
    "entities/effects/DeathAnim",
    "managers/WaveManager",
    "managers/ComboSystem",
    "managers/AudioManager",
    "managers/AchievementSystem",
    "managers/DifficultyManager",
    "ui/Minimap",
    "ui/VisualEffects",
    "ui/MobileControls"
  ],
  
  // Player.js importa
  "entities/Player.js": [
    "entities/weapons/Sword",
    "entities/weapons/Beam",
    "entities/weapons/Shotgun",
    "entities/weapons/Boomerang"
  ],
  
  // Scene standalone (no deps interne)
  "scenes/MainMenu.js": ["managers/AudioManager"],
  "scenes/GameOver.js": ["managers/AudioManager"],
  "scenes/TrophyScreen.js": [],
  "scenes/Settings.js": []
}
```

---

## 🔄 DATA FLOW MAP

```pseudocode
FLOW_MAPS = {
  
  // === SPAWN ENEMY ===
  spawn_enemy: {
    trigger: "WaveManager.startWave()",
    flow: [
      "WaveManager.spawnEnemy(type, x, y)",
      "Level.enemies.push(newEnemy)",
      "Level.physics.add.collider(enemy, player)"
    ]
  },
  
  // === KILL ENEMY ===
  kill_enemy: {
    trigger: "collision(attack, enemy)",
    flow: [
      "enemy.takeDamage(dmg)",
      "if (hp <= 0) enemy.die()",
      "Level.spawnBottle(x, y)",
      "Level.updateScore(enemy.scoreValue)",
      "WaveManager.enemyKilled()"
    ]
  },
  
  // === COLLECT ITEM ===
  collect_item: {
    trigger: "collision(player, bottle)",
    flow: [
      "bottle.applyEffect(player)",
      "player.heal() OR player.setWeapon() OR player.speedBoost()",
      "bottle.destroy()"
    ]
  },
  
  // === PLAYER DAMAGE ===
  player_damage: {
    trigger: "collision(player, enemy)",
    flow: [
      "player.takeDamage(enemy.damage)",
      "player.updateHPBar()",
      "if (hp <= 0) Level.gameOver()"
    ]
  },
  
  // === WAVE COMPLETE ===
  wave_complete: {
    trigger: "WaveManager.enemiesRemaining == 0",
    flow: [
      "WaveManager.waveComplete()",
      "Level.showWaveText()",
      "WaveManager.startWave(next)"
    ]
  }
}
```

---

## 🎮 STATE MACHINE

```pseudocode
GAME_STATES = {
  
  MAIN_MENU: {
    scene: "MainMenu",
    transitions: {
      "start_game": "PLAYING",
      "open_trophies": "TROPHIES",
      "open_settings": "SETTINGS"
    }
  },
  
  PLAYING: {
    scene: "Level",
    substates: ["WAVE_ACTIVE", "WAVE_TRANSITION", "BOSS_FIGHT", "PAUSED"],
    transitions: {
      "player_died": "GAME_OVER",
      "pause": "PAUSED"
    }
  },
  
  GAME_OVER: {
    scene: "GameOver",
    transitions: {
      "retry": "PLAYING",
      "menu": "MAIN_MENU",
      "trophies": "TROPHIES"
    }
  },
  
  TROPHIES: {
    scene: "TrophyScreen",
    transitions: {
      "back": "previous_scene"
    }
  },
  
  SETTINGS: {
    scene: "Settings",
    transitions: {
      "back": "previous_scene"
    }
  }
}
```

---

## 📁 FILE CATEGORIES

```pseudocode
CATEGORIES = {
  
  SCENES: {
    path: "src/scenes/",
    count: 7,
    files: ["Boot", "MainMenu", "Level", "GameOver", "TrophyScreen", "Settings", "HUD"]
  },
  
  ENTITIES: {
    player: { path: "src/entities/", count: 1 },
    enemies: { path: "src/entities/enemies/", count: 11 },
    bosses: { path: "src/entities/enemies/bosses/", count: 2 },
    weapons: { path: "src/entities/weapons/", count: 6 },
    items: { path: "src/entities/items/", count: 9 },
    effects: { path: "src/entities/effects/", count: 1 }
  },
  
  MANAGERS: {
    path: "src/managers/",
    count: 7,
    files: ["WaveManager", "GameManager", "AudioManager", "AchievementSystem", 
            "DifficultyManager", "ComboSystem", "EventBus"]
  },
  
  UI: {
    path: "src/ui/",
    count: 5,
    files: ["Minimap", "MobileControls", "VisualEffects", "HealthBar", "DamageText"]
  },
  
  UTILS: {
    path: "src/utils/",
    count: 3,
    files: ["Constants", "GameConfig", "MathHelpers"]
  }
}
```

---

## ⚡ MODIFICATION PATTERNS

```pseudocode
// === AGGIUNGERE NUOVO NEMICO ===
ADD_ENEMY = {
  step1: "Crea file in src/entities/enemies/NuovoNemico.js",
  step2: "Estendi Physics.Arcade.Sprite",
  step3: "Definisci: maxHP, currentHP, enemyDmg, speed",
  step4: "Implementa: constructor, update, takeDamage, die",
  step5: "Aggiungi import in Level.js",
  step6: "Aggiungi a enemiesList[] in Level.js",
  step7: "Registra in WaveManager se necessario"
}

// === AGGIUNGERE NUOVA ARMA ===
ADD_WEAPON = {
  step1: "Crea file in src/entities/weapons/NuovaArma.js",
  step2: "Estendi Physics.Arcade.Sprite",
  step3: "Definisci: speed, damage, texture",
  step4: "Implementa: constructor, update (se necessario)",
  step5: "Aggiungi import in Player.js",
  step6: "Aggiungi case in Player.shoot()",
  step7: "Crea pozione corrispondente se attivata da item"
}

// === AGGIUNGERE NUOVA POZIONE ===
ADD_POTION = {
  step1: "Crea file in src/entities/items/NuovaPozione.js",
  step2: "Estendi Physics.Arcade.Sprite",
  step3: "Definisci: texture, tint (se necessario)",
  step4: "Implementa: constructor, applyEffect(player)",
  step5: "Aggiungi import in Level.js",
  step6: "Aggiungi a bottleWeights[] con peso desiderato"
}

// === MODIFICARE BILANCIAMENTO ===
MODIFY_BALANCE = {
  enemy_stats: "Modifica direttamente nel file del nemico (maxHP, enemyDmg)",
  wave_config: "src/utils/GameConfig.js -> WAVES[]",
  spawn_rates: "Level.js -> bottleWeights[]",
  player_stats: "src/entities/Player.js -> speed, maxHP",
  difficulty: "src/managers/DifficultyManager.js"
}

// === AGGIUNGERE ACHIEVEMENT ===
ADD_ACHIEVEMENT = {
  step1: "src/managers/AchievementSystem.js",
  step2: "Aggiungi a ACHIEVEMENTS{} con id, name, description, condition",
  step3: "Aggiungi check in checkAchievements()",
  step4: "UI aggiornata automaticamente in TrophyScreen"
}
```

---

## 🔍 DEBUG QUICK REFERENCE

```pseudocode
DEBUG = {
  
  "nemico non spawna": [
    "Controlla WaveManager.spawnEnemy()",
    "Verifica enemiesList[] in Level.js",
    "Check spawn position (fuori mappa?)"
  ],
  
  "pozione non funziona": [
    "Controlla applyEffect() nella pozione",
    "Verifica collision in Level.js",
    "Check se player reference è valido"
  ],
  
  "player non si muove": [
    "Controlla Player.update()",
    "Verifica cursors input in Level.js",
    "Check physics body"
  ],
  
  "audio non parte": [
    "Controlla AudioManager.initSounds()",
    "Verifica preload in scene",
    "Browser policy: serve user interaction"
  ],
  
  "score non aggiorna": [
    "Controlla Level.updateScore()",
    "Verifica scoreText reference",
    "Check enemy.scoreValue"
  ]
}
```

---

## 📐 ARCHITECTURE RULES

```pseudocode
RULES = {
  
  // Cosa può importare cosa
  IMPORT_RULES: {
    "scenes/*": ["entities/*", "managers/*", "ui/*", "utils/*"],
    "entities/*": ["utils/*", "entities/weapons/*"],
    "managers/*": ["utils/*"],
    "ui/*": ["utils/*"],
    "utils/*": []  // Non importa nulla
  },
  
  // Chi può modificare cosa
  MODIFICATION_RULES: {
    "Player state": ["Player.js", "Level.js (collision)"],
    "Enemy state": ["Enemy files", "Level.js (collision)"],
    "Score": ["Level.js -> updateScore()"],
    "Wave": ["WaveManager.js"],
    "Audio": ["AudioManager.js"]
  },
  
  // Responsabilità singola
  RESPONSIBILITY: {
    "scenes/": "Solo lifecycle e orchestrazione",
    "entities/": "Solo logica interna dell'oggetto",
    "managers/": "Solo logica di gioco pura",
    "ui/": "Solo visualizzazione",
    "utils/": "Solo funzioni pure e costanti"
  }
}
```

---

## 🚀 FAST ACTIONS

```pseudocode
// Copia-incolla per azioni comuni

// Nuovo enemy template
TEMPLATE_ENEMY = `
import { Physics } from "phaser";
export class NuovoNemico extends Physics.Arcade.Sprite {
  maxHP = 100;
  currentHP = 100;
  enemyDmg = 20;
  constructor(scene, x, y) {
    super(scene, x, y, "texture_name");
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
  update(player) { /* chase logic */ }
  takeDamage(dmg) { /* damage logic */ }
}
`

// Nuova pozione template  
TEMPLATE_POTION = `
import { Physics } from "phaser";
export class NuovaPozione extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "potion");
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
  applyEffect(player) { /* effect logic */ }
}
`
```

---

**Fine mappa. Consultare per navigazione rapida.**
