# 🏛️ KNIGHT SHOOTER - ARCHITECTURE MASTER PLAN

> **File:** `ARCHITECTURE_MASTER.md`
> **Scopo:** Definire la struttura software, i pattern di comunicazione e le regole di refactoring per rendere il progetto scalabile e comprensibile alle AI (Copilot/Claude).
> **Riferimento:** Da usare congiuntamente a `AI_CONTEXT.md`.

---

## 1. 🏗️ FILOSOFIA ARCHITETTURALE

Il progetto sta migrando da una struttura monolitica (tutto in `Level.js`) a una struttura **Modulare Basata su Eventi**.

### Principi Core
1.  **Separazione delle Responsabilità (SoC):**
    * **Scene:** Gestiscono solo l'inizializzazione e il ciclo di vita (create/update).
    * **Entities (Player/Enemy):** Gestiscono solo la loro logica interna (movimento, animazione).
    * **Managers:** Gestiscono la logica di gioco "invisibile" (Wave, Score, Audio).
    * **UI:** Deve essere separata dalla logica di gioco.
2.  **Event Bus Pattern:** Le classi non devono chiamarsi direttamente per aggiornare la UI.
    * *Bad:* `Player` chiama `ScoreText.setText()`
    * *Good:* `Player` emette evento `ENEMY_KILLED` → `GameManager` ascolta e aggiorna score → emette `SCORE_CHANGED` → `UIManager` aggiorna testo.
3.  **Composition over Inheritance:** Usare i Manager come "componenti" logici attaccati alla Scena.

---

## 2. 📂 ALBERO DELLE DIRECTORY (TARGET)

L'obiettivo è organizzare `src/` per ridurre il rumore e migliorare la navigabilità.

```text
src/
├── 🎬 scenes/              # Solo logica di scena (Entry points)
│   ├── Boot.js             # Preload assets globali
│   ├── MainMenu.js
│   ├── Level.js            # Gameplay Scene (Orchestratore)
│   ├── HUD.js              # Scena UI sovrapposta (nuova)
│   └── GameOver.js
│
├── 👾 entities/            # Oggetti di gioco fisici
│   ├── Player.js
│   ├── enemies/            # Tutti i nemici + Enemy.js base
│   ├── weapons/            # Sword, Projectiles, ecc.
│   └── items/              # Pozioni, Powerups
│
├── 🧠 managers/            # Logica pura (Brain)
│   ├── WaveManager.js      # Spawning logic
│   ├── GameManager.js      # Score, XP, Global State
│   ├── AudioManager.js
│   ├── AchievementSystem.js
│   └── EventBus.js         # (Opzionale) o usare scene.events
│
├── 🎨 ui/                  # Componenti UI riutilizzabili
│   ├── HealthBar.js
│   ├── DamageText.js       # Floating numbers
│   └── Minimap.js
│
└── 🛠️ utils/               # Helper functions
    ├── Constants.js        # Valori hardcoded (Speed, Dmg)
    ├── GameConfig.js       # Configurazioni bilanciamento
    └── MathHelpers.js