# 📋 MIGRATION CHECKLIST

> **Data Creazione:** 2025-12-26
> **Stato:** ✅ MIGRAZIONE COMPLETATA
> **Ultimo Aggiornamento:** 2025-12-26

---

## ✅ COMPLETATO

### Struttura Directory
- [x] Creata cartella `src/scenes/`
- [x] Creata cartella `src/entities/` (con sottocartelle)
- [x] Creata cartella `src/managers/`
- [x] Creata cartella `src/ui/`
- [x] Creata cartella `src/utils/`

### File Migrati

#### Scenes ✅
- [x] `MainMenu.js` → `src/scenes/MainMenu.js`
- [x] `Level.js` → `src/scenes/Level.js`
- [x] `GameOver.js` → `src/scenes/GameOver.js`
- [x] `TrophyScreen.js` → `src/scenes/TrophyScreen.js`
- [x] `Settings.js` → `src/scenes/Settings.js`

#### Managers ✅
- [x] `WaveManager.js` → `src/managers/WaveManager.js`
- [x] `AudioManager.js` → `src/managers/AudioManager.js`
- [x] `AchievementSystem.js` → `src/managers/AchievementSystem.js`
- [x] `DifficultyManager.js` → `src/managers/DifficultyManager.js`
- [x] `ComboSystem.js` → `src/managers/ComboSystem.js`

#### Entities - Player ✅
- [x] `Player.js` → `src/entities/Player.js`

#### Entities - Enemies ✅
- [x] `Goblin.js` → `src/entities/enemies/Goblin.js`
- [x] `Slime.js` → `src/entities/enemies/Slime.js`
- [x] `SlimeRed.js` → `src/entities/enemies/SlimeRed.js`
- [x] `SlimeBlue.js` → `src/entities/enemies/SlimeBlue.js`
- [x] `SlimeGreen.js` → `src/entities/enemies/SlimeGreen.js`
- [x] `SkeletonKnight.js` → `src/entities/enemies/SkeletonKnight.js`
- [x] `Fly.js` → `src/entities/enemies/Fly.js`
- [x] `RangedEnemy.js` → `src/entities/enemies/RangedEnemy.js`
- [x] `SpeedEnemy.js` → `src/entities/enemies/SpeedEnemy.js`
- [x] `TankEnemy.js` → `src/entities/enemies/TankEnemy.js`

#### Entities - Bosses ✅
- [x] `GiantGoblin.js` → `src/entities/enemies/bosses/GiantGoblin.js`
- [x] `OrcBoss.js` → `src/entities/enemies/bosses/OrcBoss.js`

#### Entities - Weapons ✅
- [x] `Sword.js` → `src/entities/weapons/Sword.js`
- [x] `Boomerang.js` → `src/entities/weapons/Boomerang.js`
- [x] `Beam.js` → `src/entities/weapons/Beam.js`
- [x] `Thunder.js` → `src/entities/weapons/Thunder.js`
- [x] `Shotgun.js` → `src/entities/weapons/Shotgun.js`
- [x] `Shield.js` → `src/entities/weapons/Shield.js`

#### Entities - Items ✅
- [x] `Bottle.js` → `src/entities/items/Bottle.js`
- [x] `RedBottle.js` → `src/entities/items/RedBottle.js`
- [x] `BlueBottle.js` → `src/entities/items/BlueBottle.js`
- [x] `GreenBottle.js` → `src/entities/items/GreenBottle.js`
- [x] `YellowBottle.js` → `src/entities/items/YellowBottle.js`
- [x] `PurpleBottle.js` → `src/entities/items/PurpleBottle.js`
- [x] `OrangeBottle.js` → `src/entities/items/OrangeBottle.js`
- [x] `CyanBottle.js` → `src/entities/items/CyanBottle.js`
- [x] `Door.js` → `src/entities/items/Door.js`

#### Entities - Effects ✅
- [x] `DeathAnim.js` → `src/entities/effects/DeathAnim.js`

#### UI Components ✅
- [x] `Minimap.js` → `src/ui/Minimap.js`
- [x] `MobileControls.js` → `src/ui/MobileControls.js`
- [x] `VisualEffects.js` → `src/ui/VisualEffects.js`

### File Base Creati ✅
- [x] `ARCHITECTURE_PSEUDOCODE.md` - Guida completa in pseudocode
- [x] `src/scenes/Boot.js` - Scene template
- [x] `src/scenes/HUD.js` - UI overlay scene
- [x] `src/managers/GameManager.js` - Game state manager
- [x] `src/managers/EventBus.js` - Event hub
- [x] `src/utils/Constants.js` - Costanti e eventi
- [x] `src/utils/GameConfig.js` - Configurazione bilanciamento
- [x] `src/utils/MathHelpers.js` - Utility matematiche
- [x] `src/ui/HealthBar.js` - Componente barra salute
- [x] `src/ui/DamageText.js` - Floating damage numbers
- [x] `src/entities/enemies/Enemy.js` - Base class nemici (nuovo)

### Imports Aggiornati ✅
- [x] `main.js` - Tutti gli import aggiornati
- [x] `Level.js` - Tutti gli import aggiornati
- [x] `MainMenu.js` - Import AudioManager aggiornato
- [x] `GameOver.js` - Import AudioManager aggiornato
- [x] `Player.js` - Import weapons aggiornati

### Pulizia ✅
- [x] Eliminata cartella `src/Enemies/` (vecchia)
- [x] Eliminata cartella `src/Scene/` (vecchia)
- [x] Eliminati file duplicati dalla root di `src/`

---

## 📁 STRUTTURA FINALE

```
src/
├── scenes/           # Scene Phaser
│   ├── Boot.js
│   ├── MainMenu.js
│   ├── Level.js
│   ├── GameOver.js
│   ├── TrophyScreen.js
│   ├── Settings.js
│   └── HUD.js
│
├── entities/         # Game Objects
│   ├── Player.js
│   ├── enemies/
│   │   ├── Enemy.js (base)
│   │   ├── Goblin.js
│   │   ├── Slime.js
│   │   ├── SlimeRed.js
│   │   ├── SlimeBlue.js
│   │   ├── SlimeGreen.js
│   │   ├── SkeletonKnight.js
│   │   ├── Fly.js
│   │   ├── RangedEnemy.js
│   │   ├── SpeedEnemy.js
│   │   ├── TankEnemy.js
│   │   └── bosses/
│   │       ├── GiantGoblin.js
│   │       └── OrcBoss.js
│   ├── weapons/
│   │   ├── Sword.js
│   │   ├── Beam.js
│   │   ├── Boomerang.js
│   │   ├── Shotgun.js
│   │   ├── Shield.js
│   │   └── Thunder.js
│   ├── items/
│   │   ├── Bottle.js (base)
│   │   ├── RedBottle.js
│   │   ├── BlueBottle.js
│   │   ├── GreenBottle.js
│   │   ├── YellowBottle.js
│   │   ├── PurpleBottle.js
│   │   ├── OrangeBottle.js
│   │   ├── CyanBottle.js
│   │   └── Door.js
│   └── effects/
│       └── DeathAnim.js
│
├── managers/         # Game Logic
│   ├── WaveManager.js
│   ├── AudioManager.js
│   ├── AchievementSystem.js
│   ├── DifficultyManager.js
│   ├── ComboSystem.js
│   ├── GameManager.js (nuovo)
│   └── EventBus.js (nuovo)
│
├── ui/               # UI Components
│   ├── Minimap.js
│   ├── MobileControls.js
│   ├── VisualEffects.js
│   ├── HealthBar.js (nuovo)
│   └── DamageText.js (nuovo)
│
└── utils/            # Utilities
    ├── Constants.js
    ├── GameConfig.js
    └── MathHelpers.js
```

---

## 🎯 PROSSIMI PASSI (Refactoring Futuro)

1. **Refactoring Event-Driven:**
   - Implementare pattern eventi in tutti i manager
   - Rimuovere coupling diretto tra classi

2. **Level.js Optimization:**
   - Ridurre da ~1000 linee a ~300 linee
   - Delegare logica ai manager

3. **Testing:**
   - Verificare che il gioco funzioni correttamente
   - Test di tutti i path di import

---

**Migrazione completata con successo! 🎉**
- [ ] `src/Scene/Shotgun.js` → `src/entities/weapons/Shotgun.js`
- [ ] `src/Scene/Shield.js` → `src/entities/weapons/Shield.js`

### Priority 4: Items

- [ ] `src/Scene/RedBottle.js` → `src/entities/items/RedBottle.js`
- [ ] `src/Scene/BlueBottle.js` → `src/entities/items/BlueBottle.js`
- [ ] `src/Scene/GreenBottle.js` → `src/entities/items/GreenBottle.js`
- [ ] `src/Scene/YellowBottle.js` → `src/entities/items/YellowBottle.js`
- [ ] `src/Scene/PurpleBottle.js` → `src/entities/items/PurpleBottle.js`
- [ ] `src/Scene/OrangeBottle.js` → `src/entities/items/OrangeBottle.js`
- [ ] `src/Scene/CyanBottle.js` → `src/entities/items/CyanBottle.js`
- [ ] `src/Scene/Door.js` → `src/entities/items/Door.js`

### Priority 5: UI Components

- [ ] `src/Minimap.js` → `src/ui/Minimap.js`
- [ ] `src/Settings.js` → `src/ui/Settings.js`
- [ ] `src/TrophyScreen.js` → `src/ui/TrophyScreen.js`
- [ ] Creare `src/ui/ScoreDisplay.js`
- [ ] Creare `src/ui/WaveIndicator.js`
- [ ] Creare `src/ui/XPBar.js`

### Priority 6: Other Systems

- [ ] `src/VisualEffects.js` → `src/entities/effects/VisualEffects.js`
- [ ] `src/Scene/DeathAnim.js` → `src/entities/effects/DeathAnim.js`
- [ ] `src/ComboSystem.js` → `src/managers/ComboSystem.js`
- [ ] `src/MobileControls.js` → `src/ui/MobileControls.js`

---

## 🔧 REFACTORING NECESSARIO

### Level.js - CRITICO ⚠️
Questo file è il più complesso e richiede refactoring estensivo:

**Attuale:** ~2000 linee, tutto accoppiato
**Target:** ~300 linee, solo orchestrazione

**Passi:**
1. Estrarre tutta la logica di UI → HUD.js
2. Estrarre logica wave → WaveManager
3. Estrarre logica score/XP → GameManager
4. Sostituire chiamate dirette con eventi
5. Mantenere solo: init, update, cleanup

### Event System Refactoring

**Per ogni Manager/Entity:**
1. Rimuovere riferimenti diretti ad altri sistemi
2. Sostituire con `this.scene.events.emit(EVENT_NAME, data)`
3. Aggiungere listeners in `setupEventListeners()`
4. Aggiungere cleanup in `cleanup()` method

**Pattern da applicare:**
```javascript
// ❌ PRIMA (accoppiato)
this.scoreText.setText(newScore);

// ✅ DOPO (disaccoppiato)
this.scene.events.emit(EVENTS.SCORE_CHANGED, newScore);
```

---

## 📊 STATISTICHE MIGRAZIONE

### File Totali da Migrare: ~50
- Scenes: 3
- Managers: 6
- Entities: 30+
- UI: 8+
- Utils: 3 (già creati)

### Stima Tempo
- **Setup (Completato):** ✅
- **Priority 1 (Core):** 4-6 ore
- **Priority 2-3 (Entities/Weapons):** 6-8 ore
- **Priority 4-5 (Items/UI):** 4-6 ore
- **Testing & Bug Fixing:** 4-6 ore
- **TOTALE:** 18-26 ore

---

## 🎯 PROSSIMI STEP IMMEDIATI

1. **Testare la struttura corrente:**
   - Verificare che le cartelle siano create correttamente
   - Verificare che i file base funzionino

2. **Iniziare con Priority 1:**
   - Migrare MainMenu.js (semplice, per testare)
   - Migrare GameOver.js
   - Refactor Level.js (il più complesso)

3. **Setup import paths:**
   - Aggiornare main.js per importare da nuove locations
   - Verificare che i path relativi funzionino

4. **Test incrementale:**
   - Dopo ogni migrazione, testare che il gioco funzioni
   - Non migrare tutto in una volta

---

## 📝 NOTE IMPORTANTI

### Import Paths
Quando si migrano file, aggiornare gli import:
```javascript
// Prima
import Enemy from './Enemy.js';

// Dopo
import Enemy from '../entities/enemies/Enemy.js';
```

### Event Names
Usare sempre le costanti da Constants.js:
```javascript
import { EVENTS } from '../utils/Constants.js';
this.scene.events.emit(EVENTS.ENEMY_KILLED, data);
```

### Testing
Testare dopo ogni gruppo di migrazioni:
- [ ] Test dopo migrazione Scenes
- [ ] Test dopo migrazione Managers
- [ ] Test dopo migrazione Entities
- [ ] Test completo finale

---

## ✅ VERIFICATION CHECKLIST

Dopo la migrazione completa, verificare:

- [ ] Level.js è < 500 linee
- [ ] Nessun file contiene chiamate dirette UI
- [ ] Tutti usano eventi per comunicazione
- [ ] Tutti i Manager sono event-driven
- [ ] Constants.js è usato per tutti i valori fissi
- [ ] GameConfig.js è usato per bilanciamento
- [ ] Nessuna dipendenza circolare
- [ ] Ogni file ha una singola responsabilità
- [ ] Il gioco funziona come prima
- [ ] Performance non peggiorate

---

**Ultimo Aggiornamento:** 2025-12-26
**Prossimo Review:** Dopo completamento Priority 1
