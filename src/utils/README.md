# 🛠️ Utils Directory

Funzioni helper riutilizzabili e configurazioni.

## Struttura Attuale

| File | Descrizione | Stato |
|------|-------------|-------|
| **Constants.js** | Valori costanti e nomi eventi | ✅ |
| **GameConfig.js** | Configurazioni bilanciamento wave | ✅ |
| **MathHelpers.js** | Funzioni matematiche utility | ✅ |
| **EntityFactories.js** | Factory per creare nemici/items | ✅ |
| **ObjectPool.js** | Object pooling per performance | ✅ NEW |

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

## EntityFactories.js

Factory functions per creare nemici e items.

### Uso:
```javascript
import { createEnemyFactories, createBottleFactories } from '../utils/EntityFactories.js';

// Get all enemy factories
const enemyFactories = createEnemyFactories(scene);
const enemy = enemyFactories[0](x, y); // Creates SlimeGreen

// Get weighted bottle factories
const bottleFactories = createBottleFactories(scene);
```

## ObjectPool.js

Sistema di object pooling per migliorare le performance.

### Uso:
```javascript
import { PoolManager, setupCommonPools } from '../utils/ObjectPool.js';

// Setup
this.poolManager = new PoolManager(this);
setupCommonPools(this, this.poolManager);

// Spawn
const projectile = this.poolManager.spawn('projectile', x, y);

// Despawn
this.poolManager.despawn('projectile', projectile);
```

## MathHelpers.js

Funzioni matematiche comuni.

### Funzioni Disponibili:
- `getDistance(obj1, obj2)` - Distanza euclidea
- `getAngle(obj1, obj2)` - Angolo in radianti
- `randomRange(min, max)` - Random float
- `randomInt(min, max)` - Random integer
- `clamp(value, min, max)` - Limita valore
- `lerp(start, end, t)` - Interpolazione lineare

## Best Practices

### ✅ FARE:
- Aggiungere costanti invece di hardcodare valori
- Usare GameConfig per bilanciamento
- Creare nuove utility functions quando serve

### ❌ NON FARE:
- Hardcodare valori nei file di gioco
- Duplicare funzioni matematiche
- Mettere logica di gioco qui (solo utility)
