# 🛠️ Utils Directory

Funzioni helper riutilizzabili e configurazioni.

## Struttura

- **Constants.js** - Valori costanti e nomi eventi ✅
- **GameConfig.js** - Configurazioni di bilanciamento ✅
- **MathHelpers.js** - Funzioni matematiche utility ✅

## Constants.js

Contiene tutti i valori hardcoded e nomi di eventi.

### Uso:
```javascript
import { EVENTS, PLAYER, AUDIO } from '../utils/Constants.js';

// Player speed
this.speed = PLAYER.SPEED;

// Event names
this.scene.events.emit(EVENTS.ENEMY_KILLED, data);

// Audio keys
this.audioManager.play(AUDIO.SFX.ENEMY_DEATH);
```

### Benefici:
- ✅ Typo-safe (refactoring automatico)
- ✅ Single source of truth
- ✅ Facile da modificare
- ✅ Autocomplete in IDE

## GameConfig.js

Configurazioni di bilanciamento per waves e difficulty.

### Uso:
```javascript
import { WAVES, DIFFICULTY, ENEMY_TYPES } from '../utils/GameConfig.js';

// Get wave configuration
const waveConfig = WAVES[waveNumber - 1];

// Get enemy stats
const goblinStats = ENEMY_TYPES.Goblin;

// Apply difficulty
const health = goblinStats.health * DIFFICULTY.HARD.enemyHealth;
```

### Modificare Bilanciamento:
Tutti i valori per bilanciare il gioco sono qui:
- Numero nemici per wave
- Statistiche base nemici
- Drop rates items
- Moltiplicatori difficoltà

## MathHelpers.js

Funzioni matematiche comuni.

### Uso:
```javascript
import { getDistance, getAngle, clamp } from '../utils/MathHelpers.js';

// Distance between two objects
const dist = getDistance(player, enemy);

// Angle to target
const angle = getAngle(this, target);

// Clamp value
const health = clamp(newHealth, 0, maxHealth);
```

### Funzioni Disponibili:
- `getDistance(obj1, obj2)` - Distanza euclidea
- `getAngle(obj1, obj2)` - Angolo in radianti
- `randomRange(min, max)` - Random float
- `randomInt(min, max)` - Random integer
- `clamp(value, min, max)` - Limita valore
- `lerp(start, end, t)` - Interpolazione lineare
- `pointInCircle(px, py, cx, cy, r)` - Collision check
- `normalize(x, y)` - Normalizza vettore

## Best Practices

### ✅ FARE:
- Aggiungere costanti invece di hardcodare valori
- Usare GameConfig per bilanciamento
- Creare nuove utility functions quando serve

### ❌ NON FARE:
- Hardcodare valori nei file di gioco
- Duplicare funzioni matematiche
- Mettere logica di gioco qui (solo utility)

## File Completi

- [x] Constants.js ✅
- [x] GameConfig.js ✅
- [x] MathHelpers.js ✅

Tutti i file base sono stati creati!
