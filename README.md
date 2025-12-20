# 🎮 SHOOTER GAME - DOCUMENTAZIONE TECNICA COMPLETA

> **Versione:** 0.0.0  
> **Framework:** Phaser 3.80.1  
> **Build Tool:** Vite 5.2.0  
> **Tipo:** Gioco 2D Top-Down Shooter / Survival

---

## 📋 INDICE

1. [Panoramica del Progetto](#-panoramica-del-progetto)
2. [Architettura del Codice](#-architettura-del-codice)
3. [Struttura delle Directory](#-struttura-delle-directory)
4. [Componenti Principali](#-componenti-principali)
5. [Sistema di Gioco](#-sistema-di-gioco)
6. [Assets e Risorse](#-assets-e-risorse)
7. [Guida per Sviluppatori/Agenti AI](#-guida-per-sviluppatoriagenti-ai)
8. [Comandi e Configurazione](#-comandi-e-configurazione)
9. [Problemi Noti e Bug](#-problemi-noti-e-bug)
10. [Idee Future](#-idee-future)

---

## 🎯 PANORAMICA DEL PROGETTO

### Descrizione
Questo è un **gioco 2D top-down shooter/survival** sviluppato con **Phaser 3**. Il giocatore controlla un cavaliere che deve sopravvivere a ondate infinite di nemici, raccogliendo power-up (pozioni) per ottenere abilità temporanee.

### Meccaniche Core
- **Movimento:** WASD per muoversi
- **Attacco:** Click sinistro del mouse per sparare (spada o laser)
- **Obiettivo:** Uccidere più nemici possibili senza morire
- **Power-ups:** 5 tipi di pozioni con effetti diversi

### Configurazione Phaser
```javascript
// main.js - Configurazione principale
{
  width: 640,
  height: 360,
  scene: Level,
  physics: {
    default: 'arcade',
    arcade: { debug: false }
  },
  scale: {
    autoCenter: Scale.CENTER_BOTH,
    mode: Scale.FIT
  },
  pixelArt: true
}
```

---

## 🏗️ ARCHITETTURA DEL CODICE

### Pattern Utilizzato
Il progetto utilizza un'architettura **component-based** dove ogni entità di gioco è una classe che estende `Physics.Arcade.Sprite` di Phaser.

### Flusso di Esecuzione
```
main.js (Entry Point)
    ↓
Level.js (Scene principale)
    ├── preload() → Caricamento assets
    ├── create() → Inizializzazione entità
    └── update() → Game loop
           ↓
    ┌──────┴──────┐
    │   Entità    │
    ├─────────────┤
    │ - Player    │
    │ - Enemies   │
    │ - Bottles   │
    │ - Attacks   │
    └─────────────┘
```

### Diagramma delle Dipendenze
```
Level.js
├── Player.js
│   ├── Sword.js
│   └── Beam.js
├── Enemies/
│   ├── Slime.js
│   ├── Goblin.js
│   └── Fly.js
├── Scene/
│   ├── Door.js
│   ├── Shield.js
│   ├── DeathAnim.js
│   ├── Thunder.js
│   └── Bottles (Red, Yellow, Blue, Green, Purple)
```

---

## 📁 STRUTTURA DELLE DIRECTORY

```
Game_Shooter_CLM-main/
│
├── 📄 index.html          # Entry point HTML
├── 📄 main.js             # Configurazione Phaser e avvio gioco
├── 📄 style.css           # Stili globali (non usato attivamente)
├── 📄 package.json        # Dipendenze npm
│
├── 📁 src/                # Codice sorgente
│   ├── 📄 Level.js        # ⭐ SCENA PRINCIPALE (cuore del gioco)
│   │
│   ├── 📁 Enemies/        # Classi nemici
│   │   ├── 📄 Fly.js      # Nemico volante
│   │   ├── 📄 Goblin.js   # Nemico goblin
│   │   └── 📄 Slime.js    # Nemico slime
│   │
│   └── 📁 Scene/          # Oggetti di scena e gameplay
│       ├── 📄 Player.js   # ⭐ CLASSE GIOCATORE
│       ├── 📄 Sword.js    # Attacco primario (spada)
│       ├── 📄 Beam.js     # Attacco secondario (laser)
│       ├── 📄 Door.js     # Porta decorativa/animata
│       ├── 📄 Shield.js   # Scudo (power-up blu)
│       ├── 📄 DeathAnim.js # Animazione morte nemici
│       ├── 📄 Thunder.js  # Effetto fulmine (power-up viola)
│       ├── 📄 RedBottle.js    # Pozione cura
│       ├── 📄 YellowBottle.js # Pozione cambio arma
│       ├── 📄 BlueBottle.js   # Pozione scudo
│       ├── 📄 GreenBottle.js  # Pozione velocità
│       └── 📄 PurpleBottle.js # Pozione fulmine (kill-all)
│
├── 📁 assets/             # Risorse grafiche
│   ├── 📄 Map.json        # Tilemap per Phaser
│   ├── 📄 Map.tmj         # Tilemap formato Tiled JSON
│   ├── 📄 Map.tmx         # Tilemap formato Tiled XML
│   ├── 📄 tilesheet.png   # Tileset della mappa
│   ├── 📄 door.png        # Spritesheet porta
│   ├── 📄 pauseBtn.png    # Bottone pausa (non implementato)
│   │
│   ├── 📁 player/         # Sprites giocatore
│   │   ├── knight_idle.png
│   │   ├── knight_run.png
│   │   ├── sword.png
│   │   ├── laser.png
│   │   └── shield1.png
│   │
│   ├── 📁 enemy/          # Sprites nemici
│   │   ├── fly.png
│   │   ├── goblin.png
│   │   ├── slime.png
│   │   ├── explosion-6.png  # Animazione morte
│   │   ├── electro_ray.png  # Effetto fulmine
│   │   └── slime_mono.ico   # Favicon
│   │
│   └── 📁 potions/        # Sprites pozioni
│       ├── red_potion.png
│       ├── yellow_potion.png
│       ├── azure_potion.png
│       ├── green_potion.png
│       └── purple_potion.png
│
└── 📁 public/             # File statici (vuoto)
```

---

## 🧩 COMPONENTI PRINCIPALI

### 1. Level.js - Scena Principale
**Percorso:** `src/Level.js`

**Responsabilità:**
- Gestione del game loop
- Spawn dei nemici e delle pozioni
- Gestione delle collisioni
- Sistema di punteggio
- Sistema di immunità

**Proprietà Chiave:**
```javascript
// Arrays per gestione entità
enemies = [];      // Lista nemici attivi
bottles = [];      // Lista pozioni attive
attacks = [];      // Lista attacchi attivi

// Sistema immunità (scudo blu)
immunity = false;
immuneDuration = 7000;  // 7 secondi
lastCollisionTime = 0;

// Punteggio
enemyCounter = 0;
```

**Timer Importanti:**
- **Spawn Pozioni:** ogni 2000ms (2 secondi)
- **Spawn Nemici:** ogni 200ms (0.2 secondi) - ⚠️ MOLTO FREQUENTE

**Metodi Lifecycle:**
| Metodo | Descrizione |
|--------|-------------|
| `init()` | Reset variabili per restart |
| `preload()` | Caricamento tutti gli assets |
| `create()` | Setup mappa, entità, collider |
| `update()` | Game loop - eseguito ogni frame |

---

### 2. Player.js - Giocatore
**Percorso:** `src/Scene/Player.js`

**Statistiche Base:**
```javascript
speed = 80;         // Velocità movimento
maxHP = 1000;       // HP massimi
currentHP = 1000;   // HP attuali
power = false;      // false = spada, true = laser
```

**Controlli:**
| Tasto | Azione |
|-------|--------|
| W | Muovi su |
| A | Muovi sinistra |
| S | Muovi giù |
| D | Muovi destra |
| Click Sinistro | Attacca |

**Metodi Importanti:**
| Metodo | Descrizione |
|--------|-------------|
| `updateHPBar()` | Aggiorna barra vita visuale |
| `takeDamage(dmg)` | Riceve danno |
| `heal(healAmount=200)` | Cura (default 200 HP) |
| `updateAnimation()` | Switcha idle/run |

---

### 3. Nemici (Enemies/)
Tutti i nemici condividono la stessa struttura base.

**Statistiche Comuni:**
```javascript
enemyHP = 40;   // HP nemico
enemyDmg = 20;  // Danno al giocatore per collisione
```

**Comportamento:**
- Si muovono verso il giocatore (`physics.moveToObject`)
- Si girano per guardare il player (flipX)
- Velocità movimento: 40 (hardcoded in Level.js)

| Nemico | Texture | Frames | FrameRate |
|--------|---------|--------|-----------|
| Slime | slime | 0-5 | 6 |
| Goblin | goblin | 0-5 | 6 |
| Fly | fly | 0-3 | 4 |

---

### 4. Sistema Power-Up (Bottles)

| Bottiglia | Colore | Effetto | Durata |
|-----------|--------|---------|--------|
| `RedBottle` | 🔴 Rosso | Cura 200 HP | Istantaneo |
| `YellowBottle` | 🟡 Giallo | Cambia arma → Laser | Permanente* |
| `BlueBottle` | 🔵 Blu | Scudo/Immunità | 7 secondi |
| `GreenBottle` | 🟢 Verde | +120 velocità | 5 secondi |
| `PurpleBottle` | 🟣 Viola | Uccide TUTTI i nemici | Istantaneo |

*L'arma Laser rimane fino a raccolta bottiglia rossa

---

### 5. Sistema di Attacco

**Sword.js (Arma Primaria)**
```javascript
// Movimento verso il cursore
// Si distrugge dopo 5 secondi
// Body size: 10x15
```

**Beam.js (Arma Secondaria - Laser)**
```javascript
speed = 100;        // Più veloce della spada
// Si distrugge dopo 7 secondi
// Body size: 10x5
```

---

## ⚙️ SISTEMA DI GIOCO

### Ciclo di Vita del Gioco
```
1. AVVIO
   └─> Animazione porta + player scende dall'alto

2. GAMEPLAY
   ├─> Nemici spawnano fuori schermo ogni 200ms
   ├─> Pozioni spawnano in posizioni casuali ogni 2s
   ├─> Player si muove e attacca
   └─> Collisioni calcolate ogni frame

3. MORTE
   └─> Scene restart, counter reset a 0
```

### Sistema Collisioni
```javascript
// In Level.js update()

// Player + Nemici → Danno al player (se non immune)
physics.collide(player, enemies)

// Attacchi + Nemici → Morte nemico, +1 score
physics.collide(attacks, enemies)

// Player + Bottles → Applica power-up
physics.collide(player, bottles)
```

### Sistema Spawn Nemici
```javascript
// I nemici spawnano FUORI dai bounds della camera
let x = Math.Between(0, 640);
let y = Math.Between(0, 360);
if(!cameras.main.getBounds().contains(x, y)) {
  // Spawn nemico casuale dalla lista
}
```

---

## 🎨 ASSETS E RISORSE

### Spritesheet Specifications

| Asset | Dimensione Frame | File |
|-------|------------------|------|
| Knight Idle | 16x16 | knight_idle.png |
| Knight Run | 16x16 | knight_run.png |
| Sword | 16x16 | sword.png |
| Laser | 16x16 | laser.png |
| Shield | 64x64 | shield1.png |
| Fly | 16x16 | fly.png |
| Goblin | 16x16 | goblin.png |
| Slime | 16x16 | slime.png |
| Death Anim | 48x48 | explosion-6.png |
| Thunder | 64x64 | electro_ray.png |
| Door | 32x32 | door.png |
| Pozioni | 16x16 | *_potion.png |

### Mappa (Tiled)
- **Formato:** JSON (Map.json)
- **Tileset:** tilesheet.png
- **Layers:**
  1. `Floor` - Pavimento (no collisioni)
  2. `Walls` - Muri (CON collisioni)
  3. `Decorations` - Decorazioni (no collisioni)

---

## 🤖 GUIDA PER SVILUPPATORI/AGENTI AI

### ⚡ Quick Reference - Dove Modificare

| Voglio... | File da Modificare |
|-----------|-------------------|
| Aggiungere nuovo nemico | `src/Enemies/` + `Level.js` (enemiesList) |
| Aggiungere nuova pozione | `src/Scene/` + `Level.js` (bottleList + collide logic) |
| Modificare stats giocatore | `src/Scene/Player.js` |
| Modificare spawn rate nemici | `Level.js` → `time.addEvent` (delay: 200) |
| Modificare spawn rate pozioni | `Level.js` → `time.addEvent` (delay: 2000) |
| Aggiungere nuova arma | `src/Scene/` + `Player.js` (input handler) |
| Modificare mappa | `assets/Map.tmx` con Tiled Editor |
| Modificare dimensioni gioco | `main.js` (width/height) |
| Aggiungere nuova scena | Creare classe che estende `Scene` + registrarla in `main.js` |

### 📝 Come Aggiungere un Nuovo Nemico

1. **Crea il file** `src/Enemies/NuovoNemico.js`:
```javascript
import { Physics } from "phaser";

export class NuovoNemico extends Physics.Arcade.Sprite {
  enemyHP = 40;
  enemyDmg = 20;

  constructor(scene, x, y, texture = "nuovo_nemico") {
    super(scene, x, y, texture);
    
    scene.add.existing(this);
    scene.physics.add.existing(this);

    scene.anims.create({
      key: "nuovo_nemico_run",
      repeat: -1,
      frameRate: 6,
      frames: scene.anims.generateFrameNumbers(texture, {
        start: 0,
        end: 5,
      })
    });

    this.play("nuovo_nemico_run");
  }

  die() {
    this.scene.enemies.splice(this.scene.enemies.indexOf(this), 1);
    this.destroy();
  }
}
```

2. **Registra in Level.js**:
```javascript
import { NuovoNemico } from "./Enemies/NuovoNemico.js";

// In enemiesList
enemiesList = [
  (x, y) => new Slime(this, x, y),
  (x, y) => new Goblin(this, x, y),
  (x, y) => new Fly(this, x, y),
  (x, y) => new NuovoNemico(this, x, y), // AGGIUNGI QUI
];
```

3. **Carica lo spritesheet in preload()**:
```javascript
this.load.spritesheet("nuovo_nemico", "assets/enemy/nuovo_nemico.png", 
  {frameWidth: 16, frameHeight: 16});
```

### 📝 Come Aggiungere una Nuova Pozione

1. **Crea il file** `src/Scene/NuovaBottle.js` (copia struttura esistente)

2. **Registra in Level.js**:
```javascript
import { NuovaBottle } from "./Scene/NuovaBottle.js";

// In bottleList
bottleList = [
  // ... altre bottiglie ...
  (x, y) => new NuovaBottle(this, x, y),
];
```

3. **Aggiungi logica in update()** nel blocco `physics.collide(player, bottles)`:
```javascript
} else if (bottle instanceof NuovaBottle) {
  // Logica del power-up
  powerUpName = 'NuovoPowerUp';
  powerUpColor = '#hexcolor';
}
```

### 🔧 Variabili di Bilanciamento Principali

```javascript
// Level.js
delay: 200,           // Spawn rate nemici (più basso = più difficile)
delay: 2000,          // Spawn rate pozioni
immuneDuration: 7000, // Durata scudo blu

// Player.js
speed = 80;           // Velocità giocatore
maxHP = 1000;         // HP massimi
healAmount = 200;     // Cura bottiglia rossa

// Enemies (tutti)
enemyHP = 40;         // Non usato attualmente!
enemyDmg = 20;        // Danno per collisione

// GreenBottle (in Level.js)
speed += 120;         // Boost velocità
delay: 5000,          // Durata boost (5 sec)

// Beam.js
speed = 100;          // Velocità proiettile laser
```

---

## 🖥️ COMANDI E CONFIGURAZIONE

### Installazione
```bash
cd Game_Shooter_CLM-main
npm install
```

### Avvio Development Server
```bash
npm run dev
```
Apri `http://localhost:5173` nel browser

### Build per Produzione
```bash
npm run build
```
Output in cartella `dist/`

### Preview Build
```bash
npm run preview
```

---

## 🐛 PROBLEMI NOTI E BUG

### Bug Critici
1. **❌ enemyHP non utilizzato:** I nemici muoiono con un solo colpo, la proprietà `enemyHP` non è implementata.

2. **⚠️ Overlap duplicato nei nemici:** Ogni classe nemico ha un overlap con `this.player` che è undefined nel loro scope.

3. **⚠️ Memory leak potenziale:** Gli attacchi si auto-distruggono dopo 5-7 secondi ma non vengono rimossi dall'array `attacks`.

### Bug Minori
4. **🟡 Animazioni duplicate:** Le animazioni vengono ricreate ogni volta che spawna un nemico/bottiglia (non grave ma inefficiente).

5. **🟡 Speed boost non bilanciato:** La velocità torna a `speed - 110` invece di `speed - 120`, causando un leggero aumento permanente.

6. **🟡 Import inutilizzato:** `Physics` viene importato ma non usato in alcune classi (usano `Phaser.Physics.Arcade.Sprite`).

### Miglioramenti Necessari
- Nessun sistema di pausa (asset presente ma non implementato)
- Nessun menu principale
- Nessun game over screen
- Nessun sistema di salvataggio punteggio
- Nessun sistema audio

---

## 💡 IDEE FUTURE

### 🎮 GAMEPLAY / LOGICA (Back-end)

#### Priorità Alta
1. **Sistema HP Nemici Funzionante**
   - Implementare `takeDamage()` per i nemici
   - Nemici più grandi = più HP
   - Barra HP visibile sui nemici (opzionale)

2. **Sistema Waves/Livelli**
   - Wave 1-5: solo Slime
   - Wave 6-10: Slime + Goblin
   - Wave 11+: tutti i nemici
   - Boss ogni 10 wave

3. **Sistema Progressione**
   - XP per nemico ucciso
   - Level up del personaggio
   - Stats upgrade permanenti

4. **Nuovi Tipi di Nemici**
   - **Ranged Enemy:** spara proiettili
   - **Tank Enemy:** lento ma tanky
   - **Speed Enemy:** velocissimo, pochi HP
   - **Healer Enemy:** cura altri nemici
   - **Boss:** grande, pattern di attacco

5. **Nuove Armi**
   - **Shotgun:** spara 3 proiettili a ventaglio
   - **Boomerang:** torna indietro
   - **Bomba:** danno ad area
   - **Freccia penetrante:** attraversa nemici

6. **Sistema di Pausa**
   - Menu pausa con opzioni
   - Mute audio, restart, quit

7. **Salvataggio High Score**
   - LocalStorage per persistenza
   - Leaderboard locale

#### Priorità Media
8. **Nuovi Power-Up**
   - **Doppia velocità d'attacco** (arancione)
   - **Magnete:** attira pozioni e XP
   - **Bomba a tempo:** esplode dopo X secondi
   - **Clone:** crea un clone che attacca

9. **Sistema Difficoltà Dinamica**
   - Più giochi, più nemici spawnano
   - Nemici diventano più veloci col tempo
   - Spawn rate diminuisce progressivamente

10. **Diversi Personaggi**
    - Mago: più danno, meno HP
    - Tank: più HP, meno velocità
    - Assassino: più velocità, meno danno

11. **Sistema di Achievement**
    - "Uccidi 100 Slime"
    - "Sopravvivi 5 minuti"
    - "Raccogli 50 pozioni"

#### Priorità Bassa
12. **Multiplayer Locale**
    - Secondo giocatore con frecce/IJKL

13. **Sistema Combo**
    - Uccisioni consecutive = moltiplicatore punti

14. **Daily Challenge**
    - Seed giornaliero per spawn identici

---

### 🎨 ESTETICA / FRONT-END

#### Priorità Alta
1. **UI Migliorata**
   - HUD con icone pozioni raccolte
   - Timer survival in alto
   - Indicatore wave corrente
   - Mini-mappa

2. **Menu Principale**
   - Schermata titolo animata
   - Play, Options, Credits
   - Selezione personaggio

3. **Game Over Screen**
   - Statistiche partita
   - High score
   - Retry / Main Menu

4. **Feedback Visivo**
   - Screen shake quando si prende danno
   - Flash rosso bordo schermo
   - Particelle quando si raccoglie pozione
   - Trail dietro i proiettili

5. **Sistema Audio**
   - Musica background loop
   - Suoni attacco
   - Suoni morte nemici
   - Suoni raccolta pozioni
   - Suono danno ricevuto

#### Priorità Media
6. **Animazioni Migliorate**
   - Animazione attacco giocatore
   - Animazione hit sui nemici
   - Transizioni tra scene

7. **Nuove Mappe**
   - Dungeon
   - Foresta
   - Castello
   - Arena infuocata

8. **Sistema Particelle**
   - Sangue/slime alla morte nemici
   - Scintille dagli attacchi
   - Polvere dai movimenti

9. **Illuminazione Dinamica**
   - Torce nella mappa
   - Glow sulle pozioni
   - Aura sul player con scudo

10. **Sprite HD**
    - Versione 32x32 degli sprite
    - Animazioni più fluide (più frames)

#### Priorità Bassa
11. **Customizzazione Estetica**
    - Skin per il cavaliere
    - Colori personalizzabili
    - Effetti armi diversi

12. **Cutscene**
    - Intro animata
    - Story mode con dialoghi

13. **Weather Effects**
    - Pioggia
    - Neve
    - Nebbia

---

### 🔧 REFACTORING CONSIGLIATO

1. **Creare classe base `Enemy`** da cui tutti i nemici ereditano
2. **Creare classe base `Bottle`** per evitare codice duplicato
3. **Separare la logica delle collisioni** in un modulo dedicato
4. **Creare `GameManager`** per gestire stato globale
5. **Implementare State Machine** per stati del gioco (menu, playing, paused, gameover)
6. **Usare Phaser Groups** invece di array manuali
7. **Aggiungere TypeScript** per type safety

---

### 📊 ROADMAP SUGGERITA

```
FASE 1 - Fondamenta (1-2 settimane)
├── Fix bug HP nemici
├── Sistema pausa
├── Menu principale
├── Game over screen
└── Sistema audio base

FASE 2 - Core Gameplay (2-3 settimane)
├── Sistema waves
├── 2 nuovi nemici
├── 2 nuove armi
├── Sistema XP/Level
└── High score salvataggio

FASE 3 - Polish (2-3 settimane)
├── Feedback visivi (shake, flash)
├── Particelle
├── UI migliorata
├── 2 nuove mappe
└── Bilanciamento

FASE 4 - Extra (ongoing)
├── Boss
├── Achievement
├── Nuovi personaggi
└── Multiplayer locale
```

---

## 📞 NOTE FINALI PER AGENTI AI

### Checklist Prima di Modificare
- [ ] Leggi `Level.js` per capire il game loop
- [ ] Controlla `Player.js` per meccaniche giocatore
- [ ] Verifica gli array: `enemies`, `bottles`, `attacks`
- [ ] Ogni nuova entità deve essere aggiunta/rimossa dagli array
- [ ] Le animazioni usano `anims.create()` con key univoche
- [ ] Tutti gli sprite fisici estendono `Physics.Arcade.Sprite`

### Convenzioni del Codice
- Classi: PascalCase (`RedBottle`, `Player`)
- Variabili: camelCase (`enemyCounter`, `maxHP`)
- File: PascalCase per classi, lowercase per assets
- Texture keys: snake_case (`knight_idle`, `red_potion`)

### Testing Rapido
```bash
npm run dev
# Apri http://localhost:5173
# Debug Phaser: imposta arcade.debug: true in main.js
```

---

*Documento generato il 20 Dicembre 2025*
*Versione README: 1.0*
