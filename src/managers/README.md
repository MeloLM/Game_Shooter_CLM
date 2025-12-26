# 🧠 Managers Directory

Contiene tutta la logica di gioco "invisibile".

## Struttura

- **WaveManager.js** - Gestione spawn nemici e wave
- **GameManager.js** - Score, XP, livello, stato globale ✅
- **AudioManager.js** - Controllo centralizzato audio
- **AchievementSystem.js** - Sistema achievement
- **EventBus.js** - Hub eventi centralizzato (opzionale) ✅

## Responsabilità

I Manager devono:
- Gestire logica pura senza rappresentazione visiva
- Ascoltare eventi del gioco
- Aggiornare stato interno
- Emettere nuovi eventi per UI

## Pattern

```javascript
export default class MyManager {
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
  → emits ENEMY_DIED
    → WaveManager listens → decrements count → emits WAVE_COMPLETED
    → GameManager listens → adds score → emits SCORE_CHANGED
    → AudioManager listens → plays SFX
    → AchievementSystem listens → checks achievements
      → HUD listens → updates display
```

## File da Migrare

- [ ] src/WaveManager.js → managers/WaveManager.js (refactor)
- [x] managers/GameManager.js (nuovo file) ✅
- [ ] src/AudioManager.js → managers/AudioManager.js
- [ ] src/AchievementSystem.js → managers/AchievementSystem.js
- [x] managers/EventBus.js (opzionale) ✅

## File Esistenti da Refactorare

I seguenti file esistono ma devono essere refactored per usare il pattern Event-Driven:

- src/WaveManager.js (rimuovere riferimenti diretti a UI)
- src/AudioManager.js (implementare event listeners)
- src/AchievementSystem.js (implementare event listeners)
