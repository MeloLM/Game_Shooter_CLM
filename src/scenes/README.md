# 🎬 Scenes Directory

Questa cartella contiene tutte le scene del gioco.

## Struttura Attuale

| File | Descrizione | Stato |
|------|-------------|-------|
| **Boot.js** | Precarica tutti gli asset globali | ✅ |
| **MainMenu.js** | Menu principale del gioco | ✅ |
| **Level.js** | Scena di gameplay principale (Orchestrator) | ✅ |
| **HUD.js** | Overlay UI (punteggio, salute, wave) | ✅ |
| **GameOver.js** | Schermata di fine partita | ✅ |
| **Settings.js** | Impostazioni audio e grafiche | ✅ |
| **TrophyScreen.js** | Schermata trofei/achievement | ✅ |

## Responsabilità

Le scene devono SOLO:
- ✅ Inizializzare il gioco (`create`)
- ✅ Aggiornare il ciclo di gioco (`update`)
- ✅ Orchestrare i Manager
- ❌ NON contenere logica di business complessa

## Pattern

```javascript
import { Player } from '../entities/Player.js';
import { WaveManager } from '../managers/WaveManager.js';

export class MyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MyScene' });
  }

  create() {
    // 1. Setup managers
    this.waveManager = new WaveManager(this);
    this.pauseManager = new PauseManager(this);
    
    // 2. Create entities
    this.player = new Player(this, x, y);
    
    // 3. Setup event listeners
    this.events.on('ENEMY_KILLED', this.onEnemyKilled, this);
  }

  update(time, delta) {
    // Check pause state
    if (this.pauseManager.getIsPaused()) return;
    
    // Update systems
    this.player.update();
  }
}
```

## Scene Flow

```
Boot → MainMenu → Level ↔ Settings
                    ↓
               GameOver → TrophyScreen
```
