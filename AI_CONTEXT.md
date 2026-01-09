# 🤖 KNIGHT SHOOTER - AI CONTEXT DOCUMENT

> **Questo documento è progettato per fornire a qualsiasi AI (ChatGPT, Claude, Copilot, etc.) il contesto completo necessario per comprendere, modificare e migliorare questo progetto.**

---

## 📋 INFORMAZIONI PROGETTO

| Proprietà | Valore |
|-----------|--------|
| **Nome** | Knight Shooter - Survival Arena |
| **Versione** | 1.7.0 |
| **Tipo** | 2D Top-Down Shooter / Survival |
| **Framework** | Phaser 3.80.1 |
| **Build Tool** | Vite 5.2.0 |
| **Linguaggio** | JavaScript ES6+ (Modules) |
| **Target** | Browser (Desktop + Mobile responsive) |
| **Deploy** | Vercel (auto-deploy da GitHub) |
| **Storage** | localStorage per persistenza |

---

## 🎮 DESCRIZIONE GIOCO

**Knight Shooter** è un survival shooter 2D top-down dove il giocatore controlla un cavaliere che deve sopravvivere a ondate infinite di nemici.

### Gameplay Loop
```
1. Wave di nemici spawn → 2. Player uccide nemici → 3. Guadagna XP/Score
       ↓                         ↓                         ↓
4. Raccoglie pozioni → 5. Power-up temporanei → 6. Level up (stats+)
       ↓                         ↓                         ↓
7. Ogni 10 wave BOSS → 8. Difficoltà crescente → 9. Repeat fino a morte
```

### Controlli
- **WASD**: Movimento 4 direzioni
- **Mouse Click**: Attacco verso cursore
- **ESC / P**: Pausa gioco

---

## 🏗️ ARCHITETTURA COMPLETA

### Sistema Scene (Phaser)

```
┌─────────────────────────────────────────────────────────────────┐
│                         main.js                                  │
│  - Configura Phaser Game                                        │
│  - Registra tutte le scene: [MainMenu, Level, GameOver, Trophy] │
│  - Imposta physics arcade, scale responsive                     │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MainMenu.js                                 │
│  - Schermata iniziale con bottoni GIOCA e TROFEI                │
│  - Mostra high score salvato                                     │
│  - Gestisce AudioManager per musica menu                        │
└─────────────────────────────────────────────────────────────────┘
           │                                    │
           │ [click GIOCA]                      │ [click TROFEI]
           ▼                                    ▼
┌───────────────────────────┐    ┌─────────────────────────────────┐
│       Level.js            │    │       TrophyScreen.js           │
│  ⭐ SCENA GAMEPLAY        │    │  - Mostra 16 achievement        │
│  - Spawna Player          │    │  - Stato sbloccato/bloccato     │
│  - Gestisce WaveManager   │    │  - Ritorna a MainMenu           │
│  - Collisioni             │    └─────────────────────────────────┘
│  - Score/XP               │
│  - Tutti i sistemi        │
└───────────────────────────┘
           │
           │ [player muore]
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       GameOver.js                                │
│  - Mostra statistiche partita (kill, tempo, wave)               │
│  - Salva high score in localStorage                              │
│  - Mostra achievement sbloccati                                  │
│  - Bottoni: RIPROVA (→ Level) | MENU (→ MainMenu) | TROFEI      │
└─────────────────────────────────────────────────────────────────┘
```

### Dependency Graph di Level.js

```
Level.js (SCENA PRINCIPALE - 890 righe)
│
├── 👤 Player.js (364 righe)
│   ├── Movimento (WASD)
│   ├── Sistema HP (1000 base, regenerazione)
│   ├── Sistema XP/Level (level up = +stats)
│   ├── Collision con nemici
│   ├── Attacco (crea Sword/Beam/Shotgun/Boomerang)
│   └── Raccolta pozioni (effetti temporanei)
│
├── 🌊 WaveManager.js (280 righe)
│   ├── Progressione wave (ogni ~15 secondi)
│   ├── Spawn nemici con weights
│   ├── Boss ogni 10 wave
│   └── Scaling difficoltà per wave
│
├── 🔥 ComboSystem.js (150 righe)
│   ├── Combo counter (uccisioni consecutive)
│   ├── Timer reset (3 secondi senza kill)
│   ├── Moltiplicatori score (x1.0 → x5.0)
│   └── UI combo con barra timer
│
├── 🏆 AchievementSystem.js (432 righe)
│   ├── 16 achievement definiti
│   ├── Check automatico ogni 2 secondi
│   ├── Popup notifica unlock
│   ├── Persistenza localStorage
│   └── UI trofei durante gameplay
│
├── 📈 DifficultyManager.js (243 righe)
│   ├── Scaling basato su tempo + kill
│   ├── Moltiplicatori nemici (HP, DMG, Speed)
│   ├── Frequenza spawn crescente
│   └── Player history per calibrazione
│
├── 🗺️ Minimap.js (190 righe)
│   ├── Mappa scala ridotta (60x35 px)
│   ├── Dot player (verde)
│   ├── Dot nemici (rosso)
│   └── Dot pozioni (colore pozione)
│
├── ✨ VisualEffects.js (200 righe)
│   ├── Particelle morte nemici
│   ├── Flash danno player
│   ├── Trail armi
│   └── Screen effects
│
├── 🎵 AudioManager.js (124 righe)
│   ├── BGM Menu / Gameplay / Boss
│   ├── Volume control
│   ├── Fade transitions
│   └── Mute toggle
│
├── 👾 Enemies/ (cartella)
│   ├── Enemy.js (CLASSE BASE - 150 righe)
│   ├── SlimeGreen.js, SlimeBlue.js, SlimeRed.js
│   ├── Fly.js, Goblin.js
│   ├── TankEnemy.js, SpeedEnemy.js, RangedEnemy.js
│   ├── SkeletonKnight.js
│   └── Bosses/
│       ├── GiantGoblin.js
│       └── OrcBoss.js
│
└── 🎯 Scene/ (cartella - oggetti gameplay)
    ├── Sword.js (arma base)
    ├── Beam.js (laser)
    ├── Shotgun.js (3 proiettili)
    ├── Boomerang.js (ritorna)
    ├── Shield.js (invincibilità)
    ├── Thunder.js (AoE kill all)
    ├── Door.js, DeathAnim.js
    └── *Bottle.js (7 tipi pozioni)
```

---

## 📁 STRUTTURA FILE COMPLETA

```
Game_Shooter_CLM-main/
│
├── 📄 index.html           # Entry HTML, carica main.js
├── 📄 main.js              # Phaser.Game config, scene array
├── 📄 package.json         # Dependencies: phaser, vite
├── 📄 style.css            # Stili base (vuoto/minimo)
├── 📄 README.md            # Documentazione completa
├── 📄 TODO.md              # Lista task da completare
├── 📄 AI_CONTEXT.md        # QUESTO FILE
│
├── 📂 src/                 # Codice sorgente
│   │
│   ├── 📂 Scene Flow
│   │   ├── Level.js        # ⭐ GAMEPLAY PRINCIPALE (890 righe)
│   │   ├── MainMenu.js     # Menu iniziale (139 righe)
│   │   ├── GameOver.js     # Schermata morte (151 righe)
│   │   └── TrophyScreen.js # Schermata trofei (162 righe)
│   │
│   ├── 📂 Sistemi Core
│   │   ├── WaveManager.js      # Spawn nemici, wave, boss
│   │   ├── ComboSystem.js      # Combo uccisioni
│   │   ├── AchievementSystem.js # 16 achievement
│   │   ├── DifficultyManager.js # Scaling difficoltà
│   │   ├── AudioManager.js     # Musica e SFX
│   │   ├── SaveSystem.js       # 🆕 Persistenza localStorage
│   │   ├── ShopSystem.js       # 🆕 Shop upgrade tra wave
│   │   ├── PauseManager.js     # Gestione pausa
│   │   ├── CollisionManager.js # Gestione collisioni
│   │   ├── Minimap.js          # Mini-mappa
│   │   └── VisualEffects.js    # Particelle, screen shake
│   │
│   ├── 📂 Enemies/         # Classi nemici
│   │   ├── Enemy.js        # ⭐ CLASSE BASE (tutti estendono)
│   │   ├── Slime.js        # Legacy (non usato)
│   │   ├── SlimeGreen.js   # Slime standard
│   │   ├── SlimeBlue.js    # Slime tank
│   │   ├── SlimeRed.js     # Slime veloce
│   │   ├── Fly.js          # Mosca erratica
│   │   ├── Goblin.js       # Goblin resistente
│   │   ├── TankEnemy.js    # Tank lento
│   │   ├── SpeedEnemy.js   # Nemico velocissimo
│   │   ├── RangedEnemy.js  # Spara proiettili
│   │   ├── SkeletonKnight.js # Skeleton melee
│   │   ├── Assassin.js       # 🆕 Nemico stealth (invisibilità)
│   │   └── 📂 Bosses/
│   │       ├── GiantGoblin.js  # Boss wave 10,30,50...
│   │       └── OrcBoss.js      # Boss wave 20,40,60...
│   │
│   └── 📂 Scene/           # Oggetti gameplay
│       ├── Player.js       # ⭐ PLAYER (movimento, HP, XP)
│       ├── Sword.js        # Arma base (spada)
│       ├── Beam.js         # Laser (pozione gialla)
│       ├── Shotgun.js      # Shotgun (pozione arancione)
│       ├── Boomerang.js    # Boomerang (pozione cyan)
│       ├── Shield.js       # Scudo (pozione blu)
│       ├── Thunder.js      # Fulmine AoE (pozione viola)
│       ├── Door.js         # Porta decorativa
│       ├── DeathAnim.js    # Animazione morte
│       ├── Bottle.js       # Classe base pozioni
│       ├── RedBottle.js    # +HP
│       ├── YellowBottle.js # Laser
│       ├── BlueBottle.js   # Shield
│       ├── GreenBottle.js  # Speed
│       ├── PurpleBottle.js # Thunder
│       ├── OrangeBottle.js # Shotgun
│       ├── OrangeBottle.js # Shotgun
│       ├── CyanBottle.js   # Boomerang
│       ├── WhiteBottle.js  # 🆕 Frenzy Mode (2x attack speed)
│       ├── PinkBottle.js   # 🆕 Magnet (attrae pozioni/coins)
│       └── Coin.js         # 🆕 Moneta per shop
│
└── 📂 public/              # Assets statici (copiati in build)
    │
    ├── 📂 assets/
    │   ├── Map.json, Map.tmx    # Tilemap Tiled
    │   ├── tilesheet.png        # Tileset mappa
    │   ├── pauseBtn.png         # Icona pausa
    │   │
    │   ├── 📂 audio/
    │   │   ├── Menu_audio.wav   # Musica menu
    │   │   ├── Main_theme.mp3   # Musica gameplay
    │   │   └── Boss_theme.mp3   # Musica boss
    │   │
    │   ├── 📂 player/
    │   │   ├── knight_idle.png  # Spritesheet idle
    │   │   ├── knight_run.png   # Spritesheet run
    │   │   ├── sword.png        # Sprite spada
    │   │   ├── laser.png        # Sprite laser
    │   │   └── shield1.png      # Sprite scudo
    │   │
    │   ├── 📂 potions/
    │   │   ├── red_potion.png
    │   │   ├── yellow_potion.png
    │   │   ├── azure_potion.png
    │   │   ├── green_potion.png
    │   │   └── purple_potion.png
    │   │
    │   ├── 📂 enemy/
    │   │   ├── fly.png, goblin.png, slime.png
    │   │   ├── 📂 Slime_sprite_pack/PNG/
    │   │   ├── 📂 Skeleton_knight_sprite/
    │   │   ├── 📂 Random_enemy_sprite/
    │   │   └── 📂 bosses/ (GiantGoblin, Orc)
    │   │
    │   └── 📂 bosses/ (sprite boss)
    │
    └── vite.svg (favicon Vite)
```

---

## ⚔️ SISTEMA NEMICI - DETTAGLIO

### Classe Base Enemy.js

Tutti i nemici **DEVONO** estendere `Enemy.js`. Questa classe fornisce:

```javascript
class Enemy extends Physics.Arcade.Sprite {
  // Proprietà
  hp: number           // Punti vita attuali
  maxHp: number        // Punti vita massimi
  damage: number       // Danno inflitto al player
  speed: number        // Velocità movimento
  xpReward: number     // XP dato al player quando muore
  isDead: boolean      // Flag per evitare doppia morte
  hpBar: Graphics      // Barra HP sopra il nemico
  
  // Metodi che DEVI implementare
  createAnimations()   // Crea animazioni idle/run/death
  
  // Metodi ereditati (puoi sovrascrivere)
  update()             // Movimento verso player (chase)
  takeDamage(amount)   // Riceve danno, aggiorna HP bar
  die()                // Animazione morte, destroy
  updateHPBar()        // Aggiorna grafica HP bar
}
```

### Template per Nuovo Nemico

```javascript
// src/Enemies/NuovoNemico.js
import { Enemy } from './Enemy.js';

export class NuovoNemico extends Enemy {
  constructor(scene, x, y) {
    // super(scene, x, y, spriteKey, hp, damage, speed)
    super(scene, x, y, 'nuovo_idle', 50, 20, 40);
    
    this.xpReward = 15;
    this.setScale(1);
    
    // Hitbox (importante per collisioni)
    this.body.setSize(20, 16);
    this.body.setOffset(6, 10);
    
    this.createAnimations();
    this.play('nuovo_idle');
  }

  createAnimations() {
    if (!this.scene.anims.exists('nuovo_idle')) {
      this.scene.anims.create({
        key: 'nuovo_idle',
        frames: this.scene.anims.generateFrameNumbers('nuovo_idle', { start: 0, end: 5 }),
        frameRate: 8,
        repeat: -1
      });
    }
    // Aggiungi anche 'nuovo_run' e 'nuovo_death'
  }

  update() {
    if (this.isDead) return;
    super.update(); // Chase player base
    
    // Logica custom (es. pattern movimento, attacchi speciali)
  }
}
```

### Tabella Nemici Esistenti

| Nemico | HP | DMG | Speed | XP | Sprite Key | Wave Min |
|--------|-----|------|-------|-----|------------|----------|
| SlimeGreen | 40 | 20 | 40 | 10 | slimeGreen_* | 1 |
| SlimeBlue | 50 | 25 | 30 | 12 | slimeBlue_* | 5 |
| SlimeRed | 30 | 30 | 55 | 15 | slimeRed_* | 8 |
| Fly | 25 | 15 | 60 | 8 | fly_* | 4 |
| Goblin | 60 | 25 | 35 | 15 | goblin_* | 7 |
| TankEnemy | 150 | 40 | 20 | 30 | slimeBlue_* | 15 |
| SpeedEnemy | 15 | 10 | 100 | 12 | slimeRed_* | 11 |
| RangedEnemy | 35 | 15 | 25 | 18 | slimeGreen_* | 11 |
| SkeletonKnight | 80 | 35 | 35 | 25 | skeleton_* | 15 |
| Assassin | 60 | 45 | 50 | 35 | assassin_* | 18 |

### Nemico Speciale: Assassin

L'Assassin è un nemico con meccanica stealth:
- **Invisibilità ciclica**: diventa invisibile ogni 5 secondi per 3 secondi
- **Danno ridotto se invisibile**: infligge 50% danno quando è invisibile
- **Forzato visibile**: quando colpito, diventa visibile per 2 secondi

### Boss

| Boss | HP | DMG | Speed | XP | Wave Pattern |
|------|-----|------|-------|-----|--------------|
| GiantGoblin | 500 | 50 | 25 | 200 | 10, 30, 50, 70... |
| OrcBoss | 750 | 60 | 30 | 350 | 20, 40, 60, 80... |

---

## 🧪 SISTEMA POZIONI - DETTAGLIO

### Tabella Pozioni

| Colore | Classe | Sprite Key | Effetto | Durata |
|--------|--------|------------|---------|--------|
| 🔴 Rosso | RedBottle | red_bottle | +200 HP istantaneo | - |
| 🟡 Giallo | YellowBottle | yellow_bottle | Arma Laser (penetra) | 10s |
| 🔵 Blu | BlueBottle | blue_bottle | Shield invincibilità | 7s |
| 🟢 Verde | GreenBottle | green_bottle | +50% velocità | 5s |
| 🟣 Viola | PurpleBottle | purple_bottle | Thunder (kill all screen) | istant |
| 🟠 Arancione | OrangeBottle | orange_bottle | Shotgun (3 proiettili) | 10s |
| 🩵 Cyan | CyanBottle | cyan_bottle | Boomerang (ritorna) | 10s |
| ⚪ Bianco | WhiteBottle | white_bottle | Frenzy Mode (2x attack) | 5s |
| 🩷 Rosa | PinkBottle | pink_bottle | Magnet (attrae oggetti) | 8s |

### Nuovo Sistema: Coins

I nemici droppano **Coin** che possono essere usate nel **ShopSystem**:
- Slime base: 1-2 coins
- Nemici speciali: 3-5 coins
- Boss: 50-100 coins

Le coins sono attratte dal player se ha il power-up Magnet attivo.

### Spawn Pozioni

Le pozioni spawnano automaticamente in `Level.js` ogni 8-15 secondi. Probabilità:
- Rossa: 25%
- Gialla: 15%
- Blu: 15%
- Verde: 15%
- Viola: 10%
- Arancione: 10%
- Cyan: 10%

---

## 🔥 SISTEMA COMBO - DETTAGLIO

### Come Funziona

1. **Kill nemico** → Combo +1, timer reset a 3s
2. **Timer scade** → Combo reset a 0
3. **Moltiplicatore score** basato su combo attuale

### Tabella Moltiplicatori

| Combo | Multiplier | Colore UI |
|-------|------------|-----------|
| 0-2 | x1.0 | Bianco |
| 3-4 | x1.5 | Giallo |
| 5-9 | x2.0 | Arancione |
| 10-14 | x2.5 | Rosso scuro |
| 15-24 | x3.0 | Rosso |
| 25-49 | x4.0 | Viola |
| 50+ | x5.0 | Cyan |

### API ComboSystem

```javascript
// In Level.js quando nemico muore:
const multiplier = this.comboSystem.onKill();
const score = baseScore * multiplier;

// Per ottenere stats:
const { currentCombo, maxCombo, multiplier } = this.comboSystem.getStats();
```

---

## 📊 SISTEMA WAVE - DETTAGLIO

### Progressione

| Wave | Nemici Disponibili | Evento |
|------|-------------------|--------|
| 1-3 | SlimeGreen only | Tutorial soft |
| 4-6 | + SlimeBlue, Fly | Varietà base |
| 7-9 | + SlimeRed, Goblin | Aumenta difficoltà |
| **10** | - | 🔥 **BOSS: Giant Goblin** |
| 11-14 | + Speed, Ranged | Nemici speciali |
| 15-19 | + Tank, Skeleton | Late game |
| **20** | - | 🔥 **BOSS: Orc Boss** |
| 21+ | Tutti disponibili | Scaling infinito |

### Boss Spawn Logic

```javascript
// In WaveManager.js
if (currentWave % 10 === 0) {
  if (currentWave % 20 === 0) {
    spawnBoss('orc');      // Wave 20, 40, 60...
  } else {
    spawnBoss('giantGoblin'); // Wave 10, 30, 50...
  }
}
```

---

## 🏆 SISTEMA ACHIEVEMENT - DETTAGLIO

### Lista 16 Achievement

| ID | Nome | Condizione | Icona |
|----|------|------------|-------|
| 1 | First Blood | 1 uccisione | 🗡️ |
| 2 | Killer | 10 uccisioni | ⚔️ |
| 3 | Slayer | 50 uccisioni | 💀 |
| 4 | Mass Murderer | 100 uccisioni | ☠️ |
| 5 | Genocide | 500 uccisioni | 🔥 |
| 6 | Survivor | Raggiungi wave 5 | 🛡️ |
| 7 | Veteran | Raggiungi wave 10 | 🎖️ |
| 8 | Legend | Raggiungi wave 25 | 👑 |
| 9 | Combo Starter | Combo x5 | ⭐ |
| 10 | Combo Master | Combo x10 | 🌟 |
| 11 | Combo God | Combo x25 | 💫 |
| 12 | Collector | Raccogli 10 pozioni | 🧪 |
| 13 | Arsenal | Usa tutte le armi | 🔫 |
| 14 | Boss Slayer | Uccidi primo boss | 👹 |
| 15 | Boss Hunter | Uccidi 3 boss | 🐉 |
| 16 | Slime Hunter | Uccidi 100 slime | 🟢 |

### Persistenza

Achievement sbloccati salvati in `localStorage` con chiave `achievements_unlocked`.

---

## 🎵 SISTEMA AUDIO - DETTAGLIO

### File Audio

| File | Chiave | Utilizzo | Loop |
|------|--------|----------|------|
| Menu_audio.wav | bgm_menu | MainMenu, GameOver | Sì |
| Main_theme.mp3 | bgm_main | Gameplay normale | Sì |
| Boss_theme.mp3 | bgm_boss | Durante boss fight | Sì |

### API AudioManager

```javascript
// Inizializzazione (in preload + create)
this.audioManager = new AudioManager(this);
this.audioManager.preloadSounds(); // in preload()
this.audioManager.initSounds();    // in create()

// Riproduzione
this.audioManager.playMenuBGM();   // Musica menu
this.audioManager.playBGM();        // Musica gameplay
this.audioManager.playBossBGM();    // Musica boss
this.audioManager.stopBGM();        // Stop attuale
this.audioManager.stopAllBGM();     // Stop tutto
```

---

## 💾 DATI PERSISTENTI (localStorage)

| Chiave | Tipo | Descrizione |
|--------|------|-------------|
| `knightShooter_highScore` | number | Record uccisioni |
| `achievements_unlocked` | string[] | Array ID achievement |
| `player_history` | object | { gamesPlayed, highScore } |

### 🆕 SaveSystem.js

Nuovo sistema centralizzato per la persistenza:

```javascript
import SaveSystem from './managers/SaveSystem.js';

// Salvataggio
SaveSystem.saveHighscore(score);
SaveSystem.saveSetting('volume', 0.5);
SaveSystem.unlockAchievement('first_blood');

// Caricamento
const highscore = SaveSystem.loadHighscore();
const settings = SaveSystem.loadSettings();
const achievements = SaveSystem.loadAchievements();

// Export/Import (backup)
const backup = SaveSystem.exportAllData();
SaveSystem.importAllData(backup);
```

---

## 🛒 SISTEMA SHOP (Nuovo)

### ShopSystem.js

Shop accessibile tra le wave per spendere coins:

| Upgrade | Costo | Effetto |
|---------|-------|---------|
| Cura | 10 coins | +100 HP |
| Danno+ | 25 coins | +10% danno permanente |
| Velocità+ | 20 coins | +5% velocità permanente |
| Max HP+ | 30 coins | +50 HP massimi |
| Scudo | 50 coins | Shield temporaneo |

```javascript
// Apertura shop
this.shopSystem = new ShopSystem(this);
this.shopSystem.openShop();

// Acquisto
this.shopSystem.purchaseUpgrade('damage');
```

---

## 📡 EVENT BUS SYSTEM

### EventBus.js

Sistema eventi centralizzato con debug mode:

```javascript
import { EventBus } from './managers/EventBus.js';

// Emissione eventi
EventBus.emit('enemyKilled', { enemy, killer, points });
EventBus.emitEnemyKilled(enemy, killer, points);

// Ascolto eventi  
EventBus.on('enemyKilled', (data) => { ... });

// Debug mode (logga tutti gli eventi)
EventBus.setDebugMode(true);

// Cronologia eventi
const history = EventBus.getEventHistory();
```

---

## ✨ VISUAL EFFECTS (Aggiornato)

### Screen Shake

```javascript
// Shake generico
this.visualEffects.screenShake(intensity, duration);

// Shake specifici
this.visualEffects.playerDamageShake(damagePercent); // 0-100
this.visualEffects.enemyKillShake('boss'); // o 'normal'
```

### Particle Effects

```javascript
this.visualEffects.createDeathParticles(x, y, 'slime');
this.visualEffects.createBossDeathEffect(x, y);
this.visualEffects.createLevelUpEffect(x, y);
this.visualEffects.createCriticalEffect(x, y);
```

---

## 🏊 OBJECT POOLING

### ObjectPool.js

Ottimizzazione performance per oggetti frequenti:

```javascript
import { PoolManager, setupCommonPools } from './utils/ObjectPool.js';

// Setup pools comuni
this.poolManager = new PoolManager();
setupCommonPools(this, this.poolManager);

// Uso
const bullet = this.poolManager.get('bullets', x, y);
this.poolManager.release('bullets', bullet);

// Statistiche
const stats = this.poolManager.getStats();
```

---

## 🔧 COMANDI SVILUPPO

```bash
# Installazione dipendenze
npm install

# Server sviluppo (hot reload)
npm run dev
# → http://localhost:5173

# Build produzione
npm run build
# → Output in /dist

# Preview build locale
npm run preview
# → http://localhost:4173
```

---

## 🚀 DEPLOY

Il progetto è configurato per **Vercel** con auto-deploy da GitHub.

**IMPORTANTE**: Vite copia SOLO `/public` nella build. Assets devono stare in `/public/assets/`.

---

## 📝 PATTERN CODICE COMUNI

### Spawn Nemico Random
```javascript
const EnemyClass = this.enemiesList[Math.floor(Math.random() * this.enemiesList.length)];
const enemy = new EnemyClass(scene, x, y);
this.enemies.add(enemy);
```

### Timer Phaser
```javascript
this.time.delayedCall(1000, () => {
  // Eseguito dopo 1 secondo
});

this.time.addEvent({
  delay: 500,
  callback: () => { /* ogni 500ms */ },
  loop: true
});
```

### Tween Animazione
```javascript
this.tweens.add({
  targets: sprite,
  alpha: 0,
  scale: 2,
  duration: 500,
  ease: 'Power2',
  onComplete: () => sprite.destroy()
});
```

### Collisione
```javascript
this.physics.add.overlap(
  this.player,
  this.enemies,
  this.onPlayerHit,  // callback
  null,              // process callback
  this               // context
);
```

### UI Text Fixed
```javascript
const text = this.add.text(10, 10, 'Score: 0', {
  fontFamily: 'Arial',
  fontSize: '16px',
  color: '#ffffff'
});
text.setScrollFactor(0);  // Non si muove con camera
text.setDepth(100);       // Sopra tutto
```

---

## ⚠️ REGOLE PER MODIFICHE

### ✅ DA FARE

1. **Estendi classi esistenti** - Enemy.js per nemici, non reinventare
2. **Registra in Level.js** - Import, preload sprite, aggiungi a liste
3. **Testa localmente** - `npm run dev` prima di considerare finito
4. **Aggiorna documentazione** - README/TODO se aggiungi feature
5. **Usa ES6 modules** - `import`/`export`, no `require`

### ❌ DA NON FARE

1. **Non cancellare file** senza backup (usa git)
2. **Non modificare Enemy.js** se non necessario (classe base)
3. **Non hardcodare valori** - usa costanti/config
4. **Non ignorare errori console** - fix prima di commit

### File Critici - NON CANCELLARE

| File | Motivo |
|------|--------|
| Level.js | Contiene TUTTO il gameplay |
| Player.js | Logica player, HP, movimento |
| Enemy.js | Classe base TUTTI i nemici |
| WaveManager.js | Sistema wave e spawn |
| main.js | Entry point Phaser |

---

## 🎯 COME USARE QUESTO DOCUMENTO

### Per ChatGPT/Claude/AI:

1. **Copia questo intero file** nel contesto iniziale
2. **Specifica cosa vuoi modificare** (es. "aggiungi nuovo nemico", "migliora sistema combo")
3. **L'AI avrà contesto completo** su architettura, file, pattern

### Esempio Prompt:

```
Ho un gioco Phaser 3 chiamato Knight Shooter. 
[INCOLLA TUTTO AI_CONTEXT.md]

Voglio aggiungere un nuovo nemico "Ghost" che:
- Attraversa i muri
- È semi-trasparente
- Spawn dalla wave 12
- HP: 30, DMG: 25, Speed: 45

Genera il codice completo e le modifiche necessarie.
```

---

## 📊 STATISTICHE PROGETTO

| Metrica | Valore |
|---------|--------|
| Linee codice totali | ~5000 |
| File JavaScript | 42 |
| Scene Phaser | 4 |
| Tipi nemici | 11 (9 base + 2 boss) |
| Tipi pozioni | 7 |
| Achievement | 16 |
| Asset audio | 3 |
| Sprite sheets | 20+ |

---

**Questo documento fornisce il 100% del contesto necessario per comprendere e modificare il progetto Knight Shooter.**
