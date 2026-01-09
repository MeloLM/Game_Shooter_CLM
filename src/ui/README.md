# 🎨 UI Directory

Componenti UI riutilizzabili e disaccoppiati dalla logica di gioco.

## Struttura Attuale

| File | Descrizione | Stato |
|------|-------------|-------|
| **HealthBar.js** | Barra della salute | ✅ |
| **DamageText.js** | Numeri di danno fluttuanti | ✅ |
| **Minimap.js** | Minimappa in tempo reale | ✅ |
| **HUDManager.js** | Gestione centralizzata HUD | ✅ |
| **MobileControls.js** | Controlli touch per mobile | ✅ |
| **VisualEffects.js** | Particelle, trails, screen shake | ✅ |

## Responsabilità

I componenti UI devono SOLO:
- ✅ Creare elementi visuali
- ✅ Ascoltare eventi
- ✅ Aggiornare la visualizzazione
- ❌ NON contenere logica di gioco
- ❌ NON emettere eventi di logica (solo UI events)

## Pattern

```javascript
export class UIComponent {
  constructor(scene) {
    this.scene = scene;
    this.createVisuals();
    this.listenToEvents();
  }

  createVisuals() {
    this.text = this.scene.add.text(x, y, 'text');
    this.text.setScrollFactor(0); // Fixed to camera
  }

  listenToEvents() {
    // ONLY listen, never emit game logic events
    this.scene.events.on('DATA_CHANGED', this.updateDisplay, this);
  }

  updateDisplay(data) {
    this.text.setText(data);
  }
}
```

## Regole Importanti

❌ **NON FARE:**
```javascript
updateScore() {
  this.score += 10; // ❌ Logica qui
  this.text.setText(this.score);
}
```

✅ **FARE:**
```javascript
updateScore(newScore) {
  this.text.setText(newScore); // ✅ Solo display
}
```

## Event Listening

```javascript
// HealthBar → HEALTH_CHANGED
// HUDManager → SCORE_CHANGED, WAVE_CHANGED
// DamageText → DAMAGE_DEALT
// VisualEffects → ENEMY_KILLED, PLAYER_DAMAGED
```
