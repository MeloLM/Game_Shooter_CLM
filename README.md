# 🎮 KNIGHT SHOOTER - DOCUMENTAZIONE TECNICA COMPLETA

> **Versione:** 1.1.0  
> **Framework:** Phaser 3.80.1  
> **Build Tool:** Vite 5.2.0  
> **Tipo:** Gioco 2D Top-Down Shooter / Survival  
> **Ultimo Aggiornamento:** 26 Dicembre 2025

---

## 📋 INDICE

1. [Panoramica del Progetto](#-panoramica-del-progetto)
2. [Novità Versione 1.1](#-novità-versione-11)
3. [Novità Versione 1.0](#-novità-versione-10)
4. [Architettura del Codice](#-architettura-del-codice)
5. [Struttura delle Directory](#-struttura-delle-directory)
6. [Componenti Principali](#-componenti-principali)
7. [Sistema di Gioco](#-sistema-di-gioco)
8. [Assets e Risorse](#-assets-e-risorse)
9. [Guida per Sviluppatori/Agenti AI](#-guida-per-sviluppatoriagenti-ai)
10. [Comandi e Configurazione](#-comandi-e-configurazione)
11. [TODO - Bug da Fixare](#-todo---bug-da-fixare)
12. [Idee Future](#-idee-future)

---

## 🔧 TODO - BUG DA FIXARE

### Priorità Alta
- [ ] **Bug Velocità Player:** Il personaggio perde velocità nel tempo (probabilmente speed boost non resettato correttamente)
- [ ] **Achievement Invadenti:** I popup degli achievement sono troppo grandi/frequenti, rendere più discreti
- [ ] **Spawn Armi Frequente:** Le pozioni arma (Shotgun/Boomerang) spawnano troppo spesso, bilanciare la probabilità

### Da Verificare
- [ ] Aggiungere nuovi tipi di nemici (sprites necessari)
- [ ] Bilanciamento generale difficoltà

---

## 🎯 PANORAMICA DEL PROGETTO

### Descrizione
Questo è un **gioco 2D top-down shooter/survival** sviluppato con **Phaser 3**. Il giocatore controlla un cavaliere che deve sopravvivere a ondate infinite di nemici, raccogliendo power-up (pozioni) per ottenere abilità temporanee.

### Meccaniche Core
- **Movimento:** WASD per muoversi
- **Attacco:** Click sinistro del mouse per sparare (spada, laser, shotgun, boomerang)
- **Pausa:** ESC o P per mettere in pausa
- **Obiettivo:** Sopravvivere alle wave di nemici e battere il proprio record
- **Power-ups:** 7 tipi di pozioni con effetti diversi
- **Sistema Wave:** Nemici a ondate progressive con difficoltà crescente
- **Sistema XP:** Guadagna esperienza, sali di livello, potenzia il personaggio

### Configurazione Phaser
```javascript
// main.js - Configurazione principale
{
  width: 640,
  height: 360,
  scene: [MainMenu, Level, GameOver],  // Scene multiple
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

## ✨ NOVITÀ VERSIONE 1.1

### 🆕 Nuovi Sistemi
- ✅ **Sistema Wave:** Ondate progressive di nemici con difficoltà crescente
  - Wave 1-3: Solo Slime
  - Wave 4-6: Slime + Fly
  - Wave 7-10: Slime + Fly + Goblin
  - Wave 11+: Tutti i nemici base + Speed + Ranged
  - Wave 15+: Tutti + Tank
- ✅ **Sistema XP/Level Up:** Guadagna XP uccidendo nemici, sali di livello per bonus stats
- ✅ **Sistema Combo:** Uccisioni consecutive = moltiplicatore punti (x1.5, x2, x2.5, x3, x4, x5)
- ✅ **Sistema Achievement:** 16 obiettivi sbloccabili con popup e rewards XP
- ✅ **Difficoltà Dinamica:** La sfida aumenta col tempo e le performance del giocatore
- ✅ **Mini-mappa:** Mostra posizione player (verde), nemici (rosso), pozioni (cyan)

### 🎯 Nuovi Nemici
- ✅ **Tank Enemy:** Lento ma molto resistente (150 HP, 40 DMG, marrone)
- ✅ **Speed Enemy:** Velocissimo con movimento zigzag (15 HP, 10 DMG, rosso)
- ✅ **Ranged Enemy:** Spara proiettili viola, mantiene le distanze (35 HP, 15 DMG)

### ⚔️ Nuove Armi
- ✅ **Shotgun:** 3 proiettili a ventaglio (pozione arancione, 10s durata)
- ✅ **Boomerang:** Proiettile che torna indietro (pozione cyan, 10s durata)

### 🎨 Effetti Visivi
- ✅ **Trail Proiettili:** Scia visiva dietro i proiettili
- ✅ **Particelle Morte:** Esplosioni colorate per tipo di nemico
- ✅ **Effetti Hit:** Scintille quando si colpisce un nemico

### 🏗️ Refactoring
- ✅ **Classe Base Enemy:** Tutti i nemici ereditano da `Enemy.js`
- ✅ **Classe Base Bottle:** Struttura comune per le pozioni

---

## ✨ NOVITÀ VERSIONE 1.0

### 🐛 Bug Fix
- ✅ **Sistema HP Nemici:** Ora ogni nemico ha HP propri e barra vita visibile
  - Slime: 40 HP (facile)
  - Fly: 25 HP (veloce, fragile)
  - Goblin: 60 HP (resistente)
- ✅ **Memory Leak Attacchi:** Proiettili ora si rimuovono correttamente dall'array
- ✅ **Speed Boost Bug:** Corretto il bug del boost velocità permanente (+120/-120)
- ✅ **Import Math:** Risolto conflitto tra Phaser.Math e Math nativo

### 🎮 Nuove Feature
- ✅ **Menu Principale:** Schermata iniziale con titolo animato e high score
- ✅ **Game Over Screen:** Statistiche partita, high score, opzioni retry/menu
- ✅ **Sistema di Pausa:** ESC o P per pausare con overlay
- ✅ **HUD Completo:** 
  - Contatore nemici uccisi (💀)
  - Timer sopravvivenza (⏱️)
  - Indicatore arma corrente (⚔️/🔫)
  - Barra HP colorata dinamica
- ✅ **Feedback Visivi:**
  - Screen shake quando si prende danno
  - Flash rosso bordo schermo
  - Particelle colorate raccolta pozioni
- ✅ **Sistema Audio:** AudioManager pronto per file audio (opzionali)
- ✅ **Salvataggio Score:** High score salvato in localStorage

---

## 🏗️ ARCHITETTURA DEL CODICE

### Pattern Utilizzato
Il progetto utilizza un'architettura **component-based** dove ogni entità di gioco è una classe che estende `Physics.Arcade.Sprite` di Phaser.

### Flusso di Esecuzione
```
main.js (Entry Point)
    ↓
MainMenu (Scene menu)
    ↓
Level (Scene gameplay)
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
           ↓
GameOver (Scene fine partita)
```

### Diagramma delle Dipendenze
```
main.js
├── MainMenu.js (Scene menu)
├── Level.js (Scene gameplay)
│   ├── Player.js
│   │   ├── Sword.js
│   │   └── Beam.js
│   ├── Enemies/
│   │   ├── Slime.js (40 HP)
│   │   ├── Goblin.js (60 HP)
│   │   └── Fly.js (25 HP)
│   └── Scene/
│       ├── Door.js
│       ├── Shield.js
│       ├── DeathAnim.js
│       ├── Thunder.js
│       └── Bottles (Red, Yellow, Blue, Green, Purple)
├── GameOver.js (Scene game over)
└── AudioManager.js (Gestore audio)
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
│   ├── 📄 MainMenu.js     # 🆕 SCENA MENU PRINCIPALE
│   ├── 📄 Level.js        # ⭐ SCENA GAMEPLAY (cuore del gioco)
│   ├── 📄 GameOver.js     # 🆕 SCENA GAME OVER
│   ├── 📄 AudioManager.js # 🆕 GESTORE AUDIO (opzionale)
│   │
│   ├── 📁 Enemies/        # Classi nemici (con sistema HP)
│   │   ├── 📄 Fly.js      # Nemico volante (25 HP)
│   │   ├── 📄 Goblin.js   # Nemico goblin (60 HP)
│   │   └── 📄 Slime.js    # Nemico slime (40 HP)
│   │
│   └── 📁 Scene/          # Oggetti di scena e gameplay
│       ├── 📄 Player.js   # ⭐ CLASSE GIOCATORE
│       ├── 📄 Sword.js    # Attacco primario (25 dmg)
│       ├── 📄 Beam.js     # Attacco secondario (15 dmg)
│       ├── 📄 Door.js     # Porta decorativa/animata
│       ├── 📄 Shield.js   # Scudo (power-up blu)
│       ├── 📄 DeathAnim.js # Animazione morte nemici
│       ├── 📄 Thunder.js  # Effetto fulmine (power-up viola)
│       ├── 📄 RedBottle.js    # Pozione cura (+200 HP)
│       ├── 📄 YellowBottle.js # Pozione cambio arma (→ Laser)
│       ├── 📄 BlueBottle.js   # Pozione scudo (7s immunità)
│       ├── 📄 GreenBottle.js  # Pozione velocità (+120, 5s)
│       └── 📄 PurpleBottle.js # Pozione fulmine (kill-all)
│
├── 📁 assets/             # Risorse grafiche
│   ├── 📄 Map.json        # Tilemap per Phaser
│   ├── 📄 Map.tmj         # Tilemap formato Tiled JSON
│   ├── 📄 Map.tmx         # Tilemap formato Tiled XML
│   ├── 📄 tilesheet.png   # Tileset della mappa
│   ├── 📄 door.png        # Spritesheet porta
│   ├── 📄 pauseBtn.png    # Bottone pausa (asset presente)
│   │
│   ├── 📁 audio/          # 🆕 File audio (opzionali)
│   │   └── README.md      # Istruzioni per aggiungere file audio
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

### 3. MainMenu.js - Menu Principale
**Percorso:** `src/MainMenu.js`

**Funzionalità:**
- Titolo animato con effetto bounce
- Bottone Play interattivo con hover
- Visualizzazione high score da localStorage
- Istruzioni controlli
- Design pulito e responsive

**Key Features:**
```javascript
localStorage.getItem('knightShooter_highScore')  // Legge record
this.scene.start('Level')  // Avvia il gioco
```

---

### 4. GameOver.js - Schermata Game Over
**Percorso:** `src/GameOver.js`

**Funzionalità:**
- Mostra statistiche partita (kills, tempo)
- Confronta e salva high score
- Animazione "NUOVO RECORD!" se battuto
- Bottoni Retry e Menu

**Dati Ricevuti:**
```javascript
init(data) {
  this.finalScore = data.score;    // Nemici uccisi
  this.survivalTime = data.time;   // Tempo in secondi
}
```

---

### 5. Nemici (Enemies/)
**Tutti i nemici ora hanno sistema HP funzionante!**

**Statistiche per Tipo:**
| Nemico | HP | Danno | Velocità | Difficoltà |
|--------|-----|-------|----------|------------|
| Slime | 40 | 20 | 40 | ⭐ Facile |
| Goblin | 60 | 25 | 40 | ⭐⭐ Medio |
| Fly | 25 | 15 | 40 | ⭐ Veloce/Fragile |

**Nuovi Metodi:**
```javascript
maxHP = 40;              // HP massimi (varia per tipo)
currentHP = 40;          // HP attuali
hpBar;                   // Riferimento alla barra HP grafica

takeDamage(dmg) {        // ✅ ORA FUNZIONA!
  this.currentHP -= dmg;
  this.updateHPBar();
  return this.currentHP <= 0;  // true se morto
}

updateHPBar() {          // Aggiorna visuale barra HP
  // Barra verde sopra il nemico
}
```

**Comportamento:**
- Si muovono verso il giocatore (`physics.moveToObject`)
- Si girano per guardare il player (flipX)
- Velocità movimento: 40
- **Barra HP verde visibile** sopra ogni nemico
- Muoiono dopo aver ricevuto abbastanza danni

| Nemico | Texture | Frames | FrameRate |
|--------|---------|--------|-----------|
| Slime | slime | 0-5 | 6 |
| Goblin | goblin | 0-5 | 6 |
| Fly | fly | 0-3 | 4 |

---

### 6. Sistema Power-Up (Bottles)

| Bottiglia | Colore | Effetto | Durata |
|-----------|--------|---------|--------|
| `RedBottle` | 🔴 Rosso | Cura 200 HP | Istantaneo |
| `YellowBottle` | 🟡 Giallo | Cambia arma → Laser | Permanente* |
| `BlueBottle` | 🔵 Blu | Scudo/Immunità | 7 secondi |
| `GreenBottle` | 🟢 Verde | +120 velocità | 5 secondi ✅ FIXATO |
| `PurpleBottle` | 🟣 Viola | Uccide TUTTI i nemici | Istantaneo |

*L'arma Laser rimane fino a raccolta bottiglia rossa

**Effetti Visivi:** Particelle colorate appaiono quando raccogli una pozione!

---

### 7. Sistema di Attacco

**Sword.js (Arma Primaria)**
```javascript
// Danno: 25 HP per colpo
// Si distrugge dopo 5 secondi ✅ FIXATO (no memory leak)
// Body size: 10x15
```

**Beam.js (Arma Secondaria - Laser)**
```javascript
speed = 100;        // Più veloce della spada
// Danno: 15 HP per colpo
// Si distrugge dopo 7 secondi ✅ FIXATO (no memory leak)
// Body size: 10x5
```

---

### 8. HUD e UI
**Nuovo HUD Completo!**

**Elementi Superiori (Barra Nera):**
- 💀 Counter nemici uccisi (sinistra)
- ⏱️ Timer sopravvivenza (centro)
- ⚔️/🔫 Arma corrente (destra, cambia colore)

**Barra HP Inferiore:**
- Barra HP dinamica (verde/giallo/rosso)
- Testo HP numerico (es: "850/1000")
- Si adatta in tempo reale

**Sistema Pausa:**
- Overlay scuro semitrasparente
- Testo "PAUSA" grande
- Istruzioni per riprendere

---

### 9. Feedback Visivi
**Implementati:**
- 📳 **Screen Shake:** Camera trema quando prendi danno
- 🔴 **Flash Rosso:** Bordo schermo lampeggia rosso
- ✨ **Particelle:** 8 particelle colorate quando raccogli pozioni
- 🎨 **Animazioni:** Tweens per effetti fluidi

---

## ⚙️ SISTEMA DI GIOCO

### Ciclo di Vita del Gioco
```
1. MENU PRINCIPALE
   ├─> Mostra high score
   └─> Bottone Play → avvia gioco

2. GAMEPLAY
   ├─> Animazione porta + player scende dall'alto
   ├─> Nemici spawnano fuori schermo ogni 200ms
   ├─> Pozioni spawnano in posizioni casuali ogni 2s
   ├─> Player si muove e attacca
   ├─> HUD aggiornato ogni frame
   └─> Collisioni calcolate ogni frame

3. PAUSA (ESC/P)
   ├─> Fisica congelata
   └─> Overlay visibile

4. GAME OVER (HP = 0)
   ├─> Salva high score se battuto
   ├─> Mostra statistiche
   └─> Opzioni Retry/Menu

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

## ✅ PROBLEMI RISOLTI (v1.0)

### Bug Critici Fixati
1. ✅ **Sistema HP Nemici:** Completamente implementato con `takeDamage()` e barre HP visibili
   - Slime: 40 HP
   - Goblin: 60 HP
   - Fly: 25 HP

2. ✅ **Memory Leak Attacchi:** Risolto - proiettili ora si rimuovono correttamente dall'array quando scadono o colpiscono

3. ✅ **Speed Boost Bug:** Fixato - ora +120 e -120 (era +120/-110)

4. ✅ **Import Math:** Risolto conflitto tra `Phaser.Math` e `Math` nativo - ora usa `Phaser.Math.Between`

### Bug Minori Fixati
5. ✅ **Animazioni duplicate:** Ora verifico se esistono prima di crearle con `anims.exists()`

6. ✅ **Scene Key mancante:** Aggiunto `constructor()` con `super({ key: 'Level' })`

### Feature Implementate
- ✅ **Sistema di Pausa** completo (ESC/P)
- ✅ **Menu Principale** con high score
- ✅ **Game Over Screen** con statistiche
- ✅ **Salvataggio High Score** in localStorage
- ✅ **HUD Completo** con timer, kills, arma, HP
- ✅ **Feedback Visivi** (shake, flash, particelle)
- ✅ **Sistema Audio Base** (AudioManager pronto)

---

## 💡 IDEE FUTURE

### 🎮 GAMEPLAY / LOGICA (Back-end)

#### Priorità Alta
1. **Sistema Waves/Livelli**
   - Wave 1-5: solo Slime
   - Wave 6-10: Slime + Goblin
   - Wave 11+: tutti i nemici
   - Boss ogni 10 wave

2. **Sistema Progressione**
   - XP per nemico ucciso
   - Level up del personaggio
   - Stats upgrade permanenti

3. **Nuovi Tipi di Nemici**
   - **Ranged Enemy:** spara proiettili
   - **Tank Enemy:** lento ma tanky
   - **Speed Enemy:** velocissimo, pochi HP
   - **Healer Enemy:** cura altri nemici
   - **Boss:** grande, pattern di attacco

4. **Nuove Armi**
   - **Shotgun:** spara 3 proiettili a ventaglio
   - **Boomerang:** torna indietro
   - **Bomba:** danno ad area
   - **Freccia penetrante:** attraversa nemici

#### Priorità Media
5. **Nuovi Power-Up**
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
#### Priorità Alta (Estetica)
1. ✅ **UI Migliorata** - COMPLETATO
   - ✅ HUD con icone 
   - ✅ Timer survival
   - ✅ Indicatore wave corrente
   - Mini-mappa (TODO)

2. ✅ **Menu Principale** - COMPLETATO
   - ✅ Schermata titolo animata
   - ✅ Play, Options, Credits
   - Selezione personaggio (TODO)

3. ✅ **Game Over Screen** - COMPLETATO
   - ✅ Statistiche partita
   - ✅ High score
   - ✅ Retry / Main Menu

4. ✅ **Feedback Visivo** - COMPLETATO
   - ✅ Screen shake quando si prende danno
   - ✅ Flash rosso bordo schermo
   - ✅ Particelle quando si raccoglie pozione
   - Trail dietro i proiettili (TODO)

5. **Sistema Audio** - PARZIALE
   - ✅ AudioManager implementato
   - Musica background loop (TODO - file audio)
   - Suoni attacco (TODO - file audio)
   - Suoni morte nemici (TODO - file audio)
   - Suoni raccolta pozioni (TODO - file audio)
   - Suono danno ricevuto (TODO - file audio)

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
   - ✅ Particelle raccolta pozioni - COMPLETATO
   - Sangue/slime alla morte nemici (TODO)
   - Scintille dagli attacchi (TODO)
   - Polvere dai movimenti (TODO)

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
---

### 📊 ROADMAP

```
✅ FASE 1 - Fondamenta (COMPLETATA - v1.0)
├── ✅ Fix bug HP nemici
├── ✅ Fix memory leak attacchi
├── ✅ Fix speed boost bug
├── ✅ Sistema pausa
├── ✅ Menu principale
├── ✅ Game over screen
├── ✅ HUD completo
├── ✅ Feedback visivi
└── ✅ High score salvataggio

🚧 FASE 2 - Core Gameplay (In Pianificazione)
├── Sistema waves
├── 2 nuovi nemici
├── 2 nuove armi
├── Sistema XP/Level
└── File audio

🔮 FASE 3 - Polish (Futuro)
├── Animazioni migliorate
├── Sistema particelle avanzato
├── UI animations
├── 2 nuove mappe
└── Bilanciamento

🌟 FASE 4 - Extra (Futuro)
├── Boss
├── Achievement
├── Nuovi personaggi
└── Multiplayer locale
```

---

## 📞 NOTE FINALI PER AGENTI AI

### Checklist Prima di Modificare
- [x] Leggi `Level.js` per capire il game loop
- [x] Controlla `Player.js` per meccaniche giocatore
- [x] Verifica gli array: `enemies`, `bottles`, `attacks`
- [x] Ogni nuova entità deve essere aggiunta/rimossa dagli array
- [x] Le animazioni usano `anims.create()` con key univoche (verificare con `anims.exists()`)
- [x] Tutti gli sprite fisici estendono `Physics.Arcade.Sprite`
- [x] Usa `Phaser.Math.Between` non `Math.Between`
- [x] Scene devono avere constructor con `super({ key: 'NomeScene' })`

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

## 📈 CHANGELOG

### v1.1.0 (26 Dicembre 2025)
**🚀 Major Update - Sistemi Avanzati**

**Nuovi Sistemi:**
- ✅ Sistema Wave con progressione nemici
- ✅ Sistema XP e Level Up del personaggio
- ✅ Sistema Combo con moltiplicatori punti
- ✅ Sistema Achievement (16 obiettivi)
- ✅ Difficoltà Dinamica
- ✅ Mini-mappa HUD

**Nuovi Nemici:**
- ✅ Tank Enemy (lento, resistente)
- ✅ Speed Enemy (veloce, zigzag)
- ✅ Ranged Enemy (spara proiettili)

**Nuove Armi:**
- ✅ Shotgun (3 proiettili a ventaglio)
- ✅ Boomerang (torna indietro)

**Effetti Visivi:**
- ✅ Trail proiettili
- ✅ Particelle morte nemici
- ✅ Effetti hit/impatto

**Refactoring:**
- ✅ Classe base Enemy
- ✅ Classe base Bottle
- ✅ WaveManager separato
- ✅ ComboSystem separato
- ✅ VisualEffects separato

### v1.0.0 (20 Dicembre 2025)
**🎉 Release Iniziale Completa**

**Bug Fix:**
- ✅ Sistema HP nemici completamente implementato
- ✅ Memory leak attacchi risolto
- ✅ Speed boost bug fixato
- ✅ Import Math/Phaser.Math corretto
- ✅ Scene keys aggiunte

**Nuove Feature:**
- ✅ Menu principale con animazioni
- ✅ Game Over screen con statistiche
- ✅ Sistema di pausa (ESC/P)
- ✅ HUD completo (kills, timer, arma, HP)
- ✅ Feedback visivi (shake, flash, particelle)
- ✅ Sistema salvataggio high score
- ✅ AudioManager pronto per file audio

**Miglioramenti:**
- ✅ Barre HP visibili su tutti i nemici
- ✅ HUD dinamico con cambio colori
- ✅ Particelle colorate per power-up
- ✅ Ottimizzazione animazioni (check exists)

---

*Ultimo aggiornamento: 26 Dicembre 2025*  
*Versione: 1.1.0*  
*Repository: https://github.com/MeloLM/Game_Shooter_CLM*
