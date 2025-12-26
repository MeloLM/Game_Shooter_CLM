# 🎨 UI Directory

Componenti UI riutilizzabili e disaccoppiati dalla logica di gioco.

## Struttura

- **HealthBar.js** - Barra della salute ✅
- **DamageText.js** - Numeri di danno fluttuanti ✅
- **Minimap.js** - Minimappa in tempo reale

## Responsabilità

I componenti UI devono SOLO:
- Creare elementi visuali
- Ascoltare eventi
- Aggiornare la visualizzazione
- NON contenere logica di gioco
- NON emettere eventi di logica (solo UI events)

## Pattern

```javascript
export default class UIComponent {
  constructor(scene) {
    this.scene = scene;
    this.createVisuals();
    this.listenToEvents();
  }

  createVisuals() {
    // Create Phaser objects
    this.text = this.scene.add.text(x, y, 'text');
  }

  listenToEvents() {
    // ONLY listen, never emit game logic events
    this.scene.events.on('DATA_CHANGED', this.updateDisplay, this);
  }

  updateDisplay(data) {
    // Update visuals based on data
    this.text.setText(data);
  }
}
```

## Regole Importanti

❌ **NON FARE:**
```javascript
// UI non deve contenere logica
updateScore() {
  this.score += 10; // ❌ Logica qui
  this.text.setText(this.score);
}
```

✅ **FARE:**
```javascript
// UI solo visualizza
updateScore(newScore) {
  this.text.setText(newScore); // ✅ Solo display
}
```

## File da Migrare

- [x] ui/HealthBar.js ✅
- [x] ui/DamageText.js ✅
- [ ] src/Minimap.js → ui/Minimap.js

## File da Creare

- [ ] ui/ScoreDisplay.js
- [ ] ui/WaveIndicator.js
- [ ] ui/XPBar.js
- [ ] ui/BossHealthBar.js

## Event Listening Pattern

Ogni componente UI dovrebbe ascoltare eventi specifici:

```javascript
// HealthBar listens to
- HEALTH_CHANGED

// ScoreDisplay listens to
- SCORE_CHANGED

// WaveIndicator listens to
- WAVE_STARTED
- WAVE_COMPLETED

// DamageText listens to
- DAMAGE_DEALT
```
