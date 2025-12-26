# 🎬 Scenes Directory

Questa cartella contiene tutte le scene del gioco.

## Struttura

- **Boot.js** - Precarica tutti gli asset globali
- **MainMenu.js** - Menu principale (da migrare da src/)
- **Level.js** - Scena di gameplay principale (da migrare da src/)
- **HUD.js** - Overlay UI che mostra punteggio, salute, wave
- **GameOver.js** - Schermata di fine partita (da migrare da src/)

## Responsabilità

Le scene devono SOLO:
- Inizializzare il gioco (create)
- Aggiornare il ciclo di gioco (update)
- Orchestrare i Manager
- NON contenere logica di business complessa

## Pattern

```javascript
export default class MyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MyScene' });
  }

  create() {
    // 1. Setup managers
    this.gameManager = new GameManager(this);
    
    // 2. Create entities
    this.player = new Player(this, x, y);
    
    // 3. Setup event listeners
    this.events.on('SOME_EVENT', this.handler, this);
  }

  update(time, delta) {
    // Update entities and managers
    this.gameManager.update(delta);
  }
}
```

## File da Migrare

- [ ] src/MainMenu.js → scenes/MainMenu.js
- [ ] src/Level.js → scenes/Level.js (refactor)
- [ ] src/GameOver.js → scenes/GameOver.js
