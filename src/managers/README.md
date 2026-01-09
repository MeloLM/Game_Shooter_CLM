# 🧠 Managers Directory

Contiene tutta la logica di gioco "invisibile".

## Struttura Attuale

| File | Descrizione | Stato |
|------|-------------|-------|
| **WaveManager.js** | Gestione spawn nemici e wave | ✅ |
| **GameManager.js** | Score, XP, livello, stato globale | ✅ |
| **AudioManager.js** | Controllo centralizzato audio | ✅ |
| **AchievementSystem.js** | Sistema trofei/achievement | ✅ |
| **EventBus.js** | Hub eventi centralizzato con debug | ✅ |
| **PauseManager.js** | Gestione pausa gioco | ✅ |
| **CollisionManager.js** | Gestione collisioni fisiche | ✅ |
| **ComboSystem.js** | Sistema combo kill | ✅ |
| **DifficultyManager.js** | Scaling difficoltà dinamico | ✅ |
| **AssetLoader.js** | Caricamento asset centralizzato | ✅ |
| **SaveSystem.js** | Salvataggio highscores/settings | ✅ NEW |
| **ShopSystem.js** | Shop upgrade tra wave | ✅ NEW |

## Responsabilità

I Manager devono:
- ✅ Gestire logica pura senza rappresentazione visiva
- ✅ Ascoltare eventi del gioco
- ✅ Aggiornare stato interno
- ✅ Emettere nuovi eventi per UI
- ❌ NON manipolare direttamente elementi visivi

## Pattern

```javascript
export class MyManager {
  constructor(scene) {
    this.scene = scene;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.scene.events.on('GAME_EVENT', this.handler, this);
  }

  handler(data) {
    // 1. Process data
    // 2. Update internal state
    // 3. Emit new event
    this.scene.events.emit('STATE_CHANGED', result);
  }

  cleanup() {
    this.scene.events.off('GAME_EVENT', this.handler, this);
  }
}
```

## Event Flow Example

```
Enemy.die()
    → emit('ENEMY_KILLED')
    → WaveManager.onEnemyKilled()
    → GameManager.addScore()
    → emit('SCORE_CHANGED')
    → HUD.updateScore()
```
