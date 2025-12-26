# 🎮 KNIGHT SHOOTER - AI Development Bible

> **Versione:** 1.2.0  
> **Framework:** Phaser 3.80.1 | Vite 5.2.0  
> **Tipo:** 2D Top-Down Shooter / Survival  
> **Ultimo Aggiornamento:** 26 Dicembre 2025

---

## 📖 GUIDA PER AI AGENT

Questo README è progettato per essere una **guida completa** per qualsiasi AI agent che lavori su questo progetto. Contiene tutte le informazioni necessarie per capire l'architettura, aggiungere feature e risolvere bug.

### Quick Reference per AI
```
FRAMEWORK: Phaser 3 (ES6 modules)
ENTRY POINT: main.js → Level.js (gameplay principale)
NEMICI: Estendi da Enemy.js (src/Enemies/)
BOSS: Metti in src/Enemies/Bosses/
ARMI: Metti in src/Scene/
SPAWN: Configura in WaveManager.js
AUDIO: Usa AudioManager.js
```

---

## 🎯 Descrizione Gioco

Un **survival shooter 2D** dove controlli un cavaliere che deve sopravvivere a ondate infinite di nemici. Il gameplay loop:

1. **Spawn nemici** → Uccidi per XP/Score
2. **Raccogli pozioni** → Power-up temporanei
3. **Sopravvivi** → Ogni 10 wave c'è un BOSS
4. **Level up** → +HP, +Danno
5. **Repeat** → Difficoltà crescente all'infinito

### Controlli
| Tasto | Azione |
|-------|--------|
| **WASD** | Movimento |
| **Mouse Click** | Attacca |
| **ESC / P** | Pausa |

---

## 🏗️ ARCHITETTURA COMPLETA

### Scene Flow (Phaser Scenes)
```
main.js
   ↓
MainMenu.js ──[Play]──→ Level.js ──[Death]──→ GameOver.js
                              ↑                    │
                              └────[Retry]─────────┘
```

### Dependency Graph
```
Level.js (MAIN SCENE)
├── Player.js           → Gestisce movimento, HP, collisioni
├── WaveManager.js      → Spawna nemici, gestisce wave e boss
├── ComboSystem.js      → Combo uccisioni, moltiplicatore score
├── AchievementSystem.js → 16 achievement con popup
├── DifficultyManager.js → Scala difficoltà con wave
├── Minimap.js          → Mini-mappa in basso a destra
├── VisualEffects.js    → Effetti particellari
├── AudioManager.js     → Musica e SFX
│
├── Enemies/
│   ├── Enemy.js        → CLASSE BASE (tutti i nemici estendono questa)
│   ├── Slime.js        → Slime originale (legacy)
│   ├── SlimeGreen.js   → Slime verde (standard)
│   ├── SlimeBlue.js    → Slime blu (tank, lento)
│   ├── SlimeRed.js     → Slime rosso (veloce, aggressivo)
│   ├── Fly.js          → Mosca (veloce, erratica)
│   ├── Goblin.js       → Goblin (resistente)
│   ├── TankEnemy.js    → Tank (molto HP, lento)
│   ├── SpeedEnemy.js   → Speed (velocissimo, zigzag)
│   ├── RangedEnemy.js  → Ranged (spara proiettili)
│   ├── SkeletonKnight.js → Skeleton (melee, wave avanzate)
│   └── Bosses/
│       ├── GiantGoblin.js → Boss wave 10, 30, 50...
│       └── OrcBoss.js     → Boss wave 20, 40, 60...
│
└── Scene/ (Oggetti gameplay)
    ├── Sword.js        → Arma base (spada)
    ├── Beam.js         → Laser (pozione gialla)
    ├── Shotgun.js      → Shotgun 3 colpi (pozione arancione)
    ├── Boomerang.js    → Boomerang (pozione cyan)
    ├── Shield.js       → Scudo invincibilità (pozione blu)
    ├── Thunder.js      → Fulmine uccide tutti (pozione viola)
    └── *Bottle.js      → Pozioni (Red, Yellow, Blue, Green, Purple, Orange, Cyan)
```

---

## ⚔️ SISTEMA NEMICI

### Classe Base: Enemy.js
Tutti i nemici **DEVONO** estendere `Enemy.js`. Struttura minima:

```javascript
import { Enemy } from './Enemy.js';

export class NuovoNemico extends Enemy {
  constructor(scene, x, y, hp = 50, damage = 20, speed = 40) {
    super(scene, x, y, 'sprite_key', hp, damage, speed);
    this.xpReward = 15;
    this.createAnimations();
  }

  createAnimations() {
    // Definisci animazioni idle, run, death
  }

  update() {
    super.update(); // IMPORTANTE: chiama sempre super
    // Logica custom
  }
}
```

### Tabella Nemici Completa

| Nemico | File | HP | DMG | Speed | XP | Sprite | Wave Start |
|--------|------|-----|------|-------|-----|--------|------------|
| SlimeGreen | SlimeGreen.js | 40 | 20 | 40 | 10 | Slime1_* | 1 |
| SlimeBlue | SlimeBlue.js | 50 | 25 | 30 | 12 | Slime2_* | 5 |
| SlimeRed | SlimeRed.js | 30 | 30 | 55 | 15 | Slime3_* | 8 |
| Fly | Fly.js | 25 | 15 | 60 | 8 | fly_* | 4 |
| Goblin | Goblin.js | 60 | 25 | 35 | 15 | goblin_* | 7 |
| Tank | TankEnemy.js | 150 | 40 | 20 | 30 | tank_* | 15 |
| Speed | SpeedEnemy.js | 15 | 10 | 100 | 12 | speed_* | 11 |
| Ranged | RangedEnemy.js | 35 | 15 | 25 | 18 | ranged_* | 11 |
| Skeleton | SkeletonKnight.js | 80 | 35 | 35 | 25 | skeleton_* | 15 |

### Boss

| Boss | File | HP | DMG | Speed | XP | Wave |
|------|------|-----|------|-------|-----|------|
| Giant Goblin | Bosses/GiantGoblin.js | 500 | 50 | 25 | 200 | 10, 30, 50... |
| Orc Boss | Bosses/OrcBoss.js | 750 | 60 | 30 | 350 | 20, 40, 60... |

### Come Aggiungere un Nuovo Nemico

1. **Crea il file** in `src/Enemies/NuovoNemico.js`
2. **Estendi Enemy.js** (vedi template sopra)
3. **Aggiungi sprite** in `assets/enemy/`
4. **Registra in Level.js:**
   ```javascript
   // Import
   import { NuovoNemico } from './Enemies/NuovoNemico.js';
   
   // In preload() - carica sprite
   this.load.spritesheet('nuovo_idle', 'assets/enemy/.../idle.png', { frameWidth: 64, frameHeight: 64 });
   
   // In enemiesList array
   enemiesList = [SlimeGreen, ..., NuovoNemico];
   ```
5. **Configura spawn in WaveManager.js:**
   ```javascript
   // In enemyConfig
   { type: 'nuovo', weight: 1, minWave: 10, class: NuovoNemico }
   
   // In createEnemy()
   case X: return new NuovoNemico(this.scene, x, y);
   ```

---

## 🧪 SISTEMA POZIONI

| Colore | File | Key | Effetto | Durata |
|--------|------|-----|---------|--------|
| 🔴 Rossa | RedBottle.js | red_bottle | +200 HP | Istantaneo |
| 🟡 Gialla | YellowBottle.js | yellow_bottle | Arma Laser | 10s |
| 🔵 Blu | BlueBottle.js | blue_bottle | Scudo Invincibilità | 7s |
| 🟢 Verde | GreenBottle.js | green_bottle | +50% Velocità | 5s |
| 🟣 Viola | PurpleBottle.js | purple_bottle | Thunder (uccide tutti) | Istantaneo |
| 🟠 Arancione | OrangeBottle.js | orange_bottle | Shotgun (3 colpi) | 10s |
| 🩵 Cyan | CyanBottle.js | cyan_bottle | Boomerang | 10s |

### Come Aggiungere una Nuova Pozione

1. **Crea** `src/Scene/ColorBottle.js`
2. **Sprite** in `assets/potions/`
3. **Effetto** in `Player.js` metodo `collectPotion()`
4. **Spawn** configurato automaticamente in `Level.js`

---

## 🔥 SISTEMA COMBO (ComboSystem.js)

Il combo aumenta per ogni uccisione entro 3 secondi. Moltiplicatori:

| Combo | Moltiplicatore | Colore |
|-------|----------------|--------|
| 0-2 | x1.0 | Bianco |
| 3-4 | x1.5 | Giallo |
| 5-9 | x2.0 | Arancione |
| 10-14 | x2.5 | Rosso scuro |
| 15-24 | x3.0 | Rosso |
| 25-49 | x4.0 | Viola |
| 50+ | x5.0 | Cyan |

**API:**
```javascript
// In Level.js quando un nemico muore:
const multiplier = this.comboSystem.onKill(); // Ritorna moltiplicatore
const stats = this.comboSystem.getStats();    // { currentCombo, maxCombo, multiplier }
```

---

## 📊 SISTEMA WAVE (WaveManager.js)

### Progressione Wave

| Wave | Nemici Disponibili |
|------|-------------------|
| 1-3 | SlimeGreen |
| 4-6 | + SlimeBlue, Fly |
| 7-9 | + SlimeRed, Goblin |
| **10** | 🔥 **BOSS: Giant Goblin** |
| 11-14 | + Speed, Ranged |
| 15-19 | + Tank, Skeleton |
| **20** | 🔥 **BOSS: Orc** |
| 21+ | Tutti, difficoltà crescente |

### Boss Logic
```javascript
// WaveManager.js
if (wave % 10 === 0) {
  if (wave % 20 === 0) spawnOrcBoss();
  else spawnGiantGoblin();
}
```

---

## 🎵 SISTEMA AUDIO (AudioManager.js)

### File Audio
| File | Chiave | Utilizzo |
|------|--------|----------|
| Menu_audio.wav | bgm_menu | MainMenu |
| Main_theme.mp3.mp3 | bgm_main | Gameplay |
| Boss_theme.mp3.mp3 | bgm_boss | Boss fight |

### API
```javascript
// Inizializza (in create())
this.audioManager = new AudioManager(this);
this.audioManager.initSounds();

// Cambia musica
this.audioManager.playMenuBGM();  // Menu
this.audioManager.playBGM();       // Gameplay
this.audioManager.playBossBGM();   // Boss
this.audioManager.stopAllBGM();    // Stop tutto
```

---

## 🏆 SISTEMA ACHIEVEMENT (AchievementSystem.js)

16 achievement totali in categorie:
- **Kill:** 10, 50, 100, 500 uccisioni
- **Survival:** Wave 5, 10, 25
- **Combo:** Combo 5, 10, 25
- **Collection:** Pozioni, tutte le armi
- **Boss:** Primo boss, 3 boss

**API:**
```javascript
this.achievementSystem.checkAllAchievements(); // Controlla tutti
this.achievementSystem.getUnlocked();          // Lista sbloccati
```

---

## 📁 STRUTTURA FILE COMPLETA

```
Game_Shooter_CLM-main/
│
├── index.html              # Entry HTML
├── main.js                 # Config Phaser, scene registration
├── package.json            # Dependencies (phaser, vite)
├── vite.config.js          # Vite config
│
├── src/
│   ├── Level.js            # ⭐ SCENA PRINCIPALE GAMEPLAY
│   ├── MainMenu.js         # Menu iniziale
│   ├── GameOver.js         # Schermata morte
│   │
│   ├── AudioManager.js     # Gestione musica/SFX
│   ├── WaveManager.js      # Sistema ondate nemici
│   ├── ComboSystem.js      # Combo e moltiplicatori
│   ├── AchievementSystem.js # Achievement e popup
│   ├── DifficultyManager.js # Scaling difficoltà
│   ├── Minimap.js          # Mini-mappa
│   ├── VisualEffects.js    # Particelle e effetti
│   │
│   ├── Enemies/            # Classi nemici
│   │   ├── Enemy.js        # ⭐ CLASSE BASE
│   │   ├── Slime.js
│   │   ├── SlimeGreen.js
│   │   ├── SlimeBlue.js
│   │   ├── SlimeRed.js
│   │   ├── Fly.js
│   │   ├── Goblin.js
│   │   ├── TankEnemy.js
│   │   ├── SpeedEnemy.js
│   │   ├── RangedEnemy.js
│   │   ├── SkeletonKnight.js
│   │   └── Bosses/
│   │       ├── GiantGoblin.js
│   │       └── OrcBoss.js
│   │
│   └── Scene/              # Oggetti di gioco
│       ├── Player.js       # ⭐ PLAYER (HP, movimento, collisioni)
│       ├── Sword.js        # Arma base
│       ├── Beam.js         # Laser
│       ├── Shotgun.js      # Shotgun
│       ├── Boomerang.js    # Boomerang
│       ├── Shield.js       # Scudo
│       ├── Thunder.js      # Fulmine AoE
│       ├── Door.js         # Porta (non usata)
│       ├── DeathAnim.js    # Animazione morte nemici
│       ├── RedBottle.js
│       ├── YellowBottle.js
│       ├── BlueBottle.js
│       ├── GreenBottle.js
│       ├── PurpleBottle.js
│       ├── OrangeBottle.js
│       └── CyanBottle.js
│
└── assets/
    ├── Map.json, Map.tmx   # Tilemap (Tiled)
    │
    ├── audio/
    │   ├── Menu_audio.wav
    │   ├── Main_theme.mp3.mp3
    │   └── Boss_theme.mp3.mp3
    │
    ├── player/             # Sprite player
    │
    ├── potions/            # Sprite pozioni
    │
    └── enemy/
        ├── Slime_sprite_pack/      # Slime 1, 2, 3
        │   └── PNG/Slime{1,2,3}/With_shadow/
        │
        ├── Skeleton_knight_sprite/ # Skeleton
        │
        ├── Random_enemy_sprite/    # Fly, Goblin, etc
        │
        └── Bosses_sprite/          # Giant Goblin
        └── Orc_boss_sprite/        # Orc Boss
```

---

## 🚀 COMANDI

```bash
# Installazione
npm install

# Development (hot reload)
npm run dev

# Build produzione
npm run build

# Preview build
npm run preview
```

---

## 🐛 DEBUG E TESTING

### Console Logs Utili
```javascript
// Level.js già logga:
console.log(`Wave ${wave} started`);
console.log(`Kill: ${count} | Score: ${score} (x${multiplier})`);
console.log(`Level up! Now level ${level}`);
```

### Testare Specifiche Wave
In `WaveManager.js`, modifica temporaneamente:
```javascript
this.currentWave = 9; // Per testare boss wave 10
```

### Testare Boss
```javascript
// In Level.js create(), aggiungi:
this.createBoss('giantGoblin', 400, 300);
```

---

## 📝 CHANGELOG

### v1.2.0 (26 Dicembre 2025)
- ✅ 3 nuovi tipi di Slime (Green, Blue, Red) con sprite animati
- ✅ Boss system: Giant Goblin e Orc ogni 10 wave
- ✅ Skeleton Knight enemy
- ✅ Sistema audio completo (menu, gameplay, boss)
- ✅ README trasformato in AI Development Bible

### v1.1.0 (26 Dicembre 2025)
- Sistema Wave progressivo
- Sistema XP/Level up
- 3 nuovi nemici (Tank, Speed, Ranged)
- 2 nuove armi (Shotgun, Boomerang)
- Sistema Combo e Achievement
- Mini-mappa e effetti visivi

### v1.0.0
- Release iniziale
- 3 nemici base (Slime, Fly, Goblin)
- 5 pozioni originali
- Sistema HP funzionante
- Menu e Game Over

---

## 🔮 IDEE FUTURE (Roadmap Completa)

### 🎯 Priorità Alta (Next Update)
- [ ] **Sistema Oro/Monete** - Nemici droppano gold
- [ ] **Negozio tra Wave** - Compra upgrade tra una wave e l'altra
- [ ] **Upgrade Permanenti** - HP max, Danno, Velocità, Armor
- [ ] **Nuovi Boss** - Dragone (wave 50), Lich (wave 100), Demon Lord (wave 150)
- [ ] **Abilità Attive** - Dash, Ground Slam, Berserk Mode con cooldown
- [ ] **Sistema Salvataggio** - LocalStorage per progressi e high score

### 🎮 Gameplay Espanso
- [ ] **Classi Giocatore** - Guerriero (tank), Mago (ranged), Arciere (speed), Paladino (balanced)
- [ ] **Skill Tree** - Albero abilità per ogni classe
- [ ] **Armi Permanenti** - Sblocca e equipaggia armi che persistono
- [ ] **Secondary Weapon Slot** - Due armi equipaggiate, switch con Q
- [ ] **Nemici che si Dividono** - Big Slime → 2 Medium → 4 Small
- [ ] **Nemici Volanti** - Ignorano collisioni terreno
- [ ] **Elite Enemies** - Aura colorata, 2x stats, drop garantito
- [ ] **Mini-boss** - Wave 5, 15, 25... versioni potenziate di nemici normali
- [ ] **Nemici con Shield** - Devono essere colpiti alle spalle
- [ ] **Nemici Healer** - Curano altri nemici vicini
- [ ] **Nemici Spawner** - Generano altri nemici finché vivi

### ⚔️ Combat System
- [ ] **Status Effects:**
  - 🔥 Burn - DOT 5s
  - ❄️ Freeze - Slow 50% per 3s
  - ⚡ Shock - Stun 1s
  - ☠️ Poison - DOT 10s
  - 💀 Curse - -50% healing
- [ ] **Critical Hits** - 10% chance, 2x damage
- [ ] **Armor System** - Riduzione danno percentuale
- [ ] **Dodge/Roll** - Invincibilità breve, cooldown
- [ ] **Parry** - Timing perfetto respinge proiettili
- [ ] **Combo Attacks** - Sequenze di attacchi per bonus damage

### 🗺️ Mondo e Mappe
- [ ] **Mappa Procedurale** - Ostacoli generati casualmente
- [ ] **Biomi Diversi:**
  - 🌲 Foresta - Nemici verdi, più Slime
  - 🏰 Dungeon - Skeleton e Ghost
  - 🌋 Vulcano - Fire enemies, lava pools
  - ❄️ Tundra - Ice enemies, terreno scivoloso
  - 🏜️ Deserto - Sandworm boss, tempeste di sabbia
- [ ] **Ostacoli Interattivi** - Barili esplosivi, trappole attivabili
- [ ] **Portali Teleport** - Fast travel sulla mappa
- [ ] **Zone Sicure** - Aree dove i nemici non entrano (negozio)
- [ ] **Secret Rooms** - Stanze nascoste con loot raro
- [ ] **Trappole Ambientali** - Spine, lava, zone che rallentano

### 🎁 Loot e Rewards
- [ ] **Sistema Rarità:**
  - ⬜ Common
  - 🟢 Uncommon  
  - 🔵 Rare
  - 🟣 Epic
  - 🟡 Legendary
- [ ] **Casse del Tesoro** - Spawn casuali, richiedono chiave o tempo
- [ ] **Daily Rewards** - Login giornaliero
- [ ] **Loot Table per Nemico** - Drop specifici per tipo nemico
- [ ] **Crafting Base** - Combina materiali per pozioni migliori

### 🎨 Visual e Audio
- [ ] **Animazioni Boss Speciali** - Attacchi unici animati
- [ ] **Screen Shake Dinamico** - Intensità basata sul danno
- [ ] **Hit Stop** - Freeze frame su colpi potenti
- [ ] **Particle System Avanzato** - Blood, sparks, magic effects
- [ ] **Day/Night Cycle** - Nemici più forti di notte, visibilità ridotta
- [ ] **Weather Effects** - Pioggia, neve, nebbia
- [ ] **Dynamic Soundtrack** - Musica che scala con l'intensità del combattimento
- [ ] **Voice Lines** - Player reactions, enemy sounds
- [ ] **UI Animations** - Transizioni smooth, feedback visivo

### 📱 Technical e Platform
- [ ] **Mobile Support:**
  - Virtual joystick sinistra
  - Attack button destra
  - Ability buttons
  - UI scalabile
- [ ] **Gamepad Support** - Xbox/PlayStation controller
- [ ] **Multiplayer Locale** - 2-4 player split screen
- [ ] **Multiplayer Online** - Co-op via WebSocket/WebRTC
- [ ] **Leaderboard Globale** - Firebase/Supabase backend
- [ ] **Cloud Save** - Sincronizza tra dispositivi
- [ ] **Replay System** - Registra e rivedi partite
- [ ] **Screenshot/Clip** - Condividi momenti epici
- [ ] **Mod Support** - Carica nemici/armi custom

### 🏆 Meta-Game e Progression
- [ ] **Account Level** - XP globale, rewards a milestone
- [ ] **50+ Achievement** - Obiettivi nascosti e visibili
- [ ] **Statistiche Complete:**
  - Tempo totale giocato
  - Nemici uccisi per tipo
  - Danno totale inflitto/ricevuto
  - Pozioni raccolte
  - Record personali
- [ ] **Season Pass** - Sfide settimanali/mensili
- [ ] **Skin Sbloccabili** - Player, armi, effetti
- [ ] **Titles/Badges** - Mostra achievements nel profilo
- [ ] **Prestige System** - Reset per bonus permanenti

### 🎲 Modalità di Gioco
- [ ] **Classic Mode** - Modalità attuale, wave infinite
- [ ] **Story Mode** - Progressione con dialoghi e lore
- [ ] **Endless Mode** - No boss, solo sopravvivenza pura
- [ ] **Boss Rush** - Solo boss, uno dopo l'altro, timer
- [ ] **Roguelike Mode** - Scegli upgrade random tra wave
- [ ] **Daily Challenge** - Seed fisso, classifica giornaliera
- [ ] **Weekly Challenge** - Modificatori speciali
- [ ] **Hardcore Mode** - Permadeath, no respawn
- [ ] **Ironman Mode** - Un solo salvataggio, autosave
- [ ] **Speed Run Mode** - Timer, wave fisse, leaderboard
- [ ] **Sandbox/Practice** - Testa build e strategie

### 🧪 Idee Sperimentali
- [ ] **Pet System** - Companion che attacca/supporta
- [ ] **Base Building** - Costruisci difese tra wave
- [ ] **Territory Control** - Conquista zone della mappa
- [ ] **PvP Arena** - 1v1 o 2v2 contro altri player
- [ ] **Raid Bosses** - Boss multiplayer cooperativo
- [ ] **Seasonal Events** - Halloween, Natale, etc.
- [ ] **New Game+** - Ricomincia con bonus, nemici più forti

---

## 💡 NOTE PER AI AGENT

### ⚠️ REGOLE FONDAMENTALI

1. **MAI cancellare file senza backup** - Usa git per recuperare se necessario
2. **Testa sempre** - `npm run dev` prima di considerare finito
3. **Aggiorna questo README** - Ad ogni feature significativa
4. **Mantieni backward compatibility** - Non rompere sistemi esistenti

### Quando Aggiungi Codice
1. **Segui lo stile esistente** - ES6 modules, classi, JSDoc comments
2. **Estendi le classi base** - Enemy.js per nemici, non reinventare
3. **Registra in Level.js** - Import, preload sprite, aggiungi a liste
4. **Configura WaveManager** - Per spawn automatico
5. **Testa localmente** - `npm run dev` e prova in game

### Quando Modifichi Codice Esistente
1. **Leggi prima il file intero** - Capire il contesto
2. **Modifica chirurgicamente** - Cambia solo il necessario
3. **Mantieni i commenti** - Aiutano altri AI e sviluppatori
4. **Non rimuovere feature** - A meno che non sia esplicitamente richiesto

### Pattern Comuni del Progetto
```javascript
// Spawn nemico random
const EnemyClass = this.enemiesList[Math.floor(Math.random() * this.enemiesList.length)];
new EnemyClass(scene, x, y);

// Timer Phaser
this.time.delayedCall(1000, () => { /* dopo 1s */ });

// Tween animazione
this.tweens.add({ targets: obj, alpha: 0, duration: 500 });

// Collisione
this.physics.add.overlap(player, enemies, this.onHit, null, this);

// Suono
this.sound.play('sound_key', { volume: 0.5 });

// Testo UI
this.add.text(x, y, 'Text', { fontSize: '16px', color: '#fff' }).setScrollFactor(0);
```

### File Critici - NON CANCELLARE
| File | Motivo |
|------|--------|
| Level.js | Tutto il gameplay, scene principale |
| Player.js | Logica player, HP, collisioni |
| WaveManager.js | Spawn nemici, progressione wave |
| Enemy.js | Classe base tutti i nemici |
| ComboSystem.js | Sistema combo/moltiplicatore |
| AudioManager.js | Gestione audio centralizzata |
| main.js | Entry point, config Phaser |

### Come Recuperare File Cancellati
```bash
# Vedi versioni precedenti
git log --oneline -10

# Recupera file specifico da commit
git show <commit_hash>:src/NomeFile.js > src/NomeFile.js

# Oppure ripristina tutto a un commit
git checkout <commit_hash> -- src/NomeFile.js
```

### Checklist Pre-Commit
- [ ] `npm run dev` funziona senza errori console
- [ ] Nuove feature testate in game
- [ ] Import aggiunti dove necessario
- [ ] Nessun `console.log` di debug lasciato
- [ ] README aggiornato se necessario

---

**Questo README è la SINGLE SOURCE OF TRUTH per il progetto. Mantienilo aggiornato!**
