# Architecture & Project Structure

This document provides a comprehensive map of the project for AI agents. It describes the file structure, key components, and the event-driven architecture used in the **Knight Shooter** game.

## Tech Stack
- **Framework**: Phaser 3 (Game Engine)
- **Build Tool**: Vite
- **Language**: JavaScript (ES6 Modules)

## Project Map (`src/`)

### 1. Scenes (`src/scenes/`)
Entry points for different game states.
- **`MainMenu.js`**: Homepage. Handles navigation, settings, sound initialization.
- **`Level.js`**: **Main Gameplay Orchestrator**.
  - Initializes all Managers.
  - Handles the main Update loop (delegating to managers).
  - Manages Entity creation (Player, Enemies).
- **`HUD.js`**: Legacy/Overlay, largely superseded by `HUDManager.js` but kept for scene structure.
- **`GameOver.js`**: End screen with score summary and restart.
- **`Settings.js`**: Options menu (Volume, etc.).
- **`TrophyScreen.js`**: Dedicated scene for viewing achievements from the Main Menu.

### 2. Managers (`src/managers/`)
Core logic separated by domain. **Event-Driven**: They communicate via `scene.events`.
- **`AssetLoader.js`**: specific centralized loading of all assets (images, spritesheets, JSON).
- **`AudioManager.js`**: Handles BGM and SFX.
- **`CollisionManager.js`**: Central physics handler.
  - `handleBottleCollision`: Powerups.
  - `handleEnemyCollision`: Damage/Knockback.
  - `handleCoinCollision`: Pickup logic.
  - `handleAttackEnemyCollision`: Combat logic.
- **`WaveManager.js`**: Controls enemy spawning waves, difficulty progression, and state.
- **`ShopSystem.js`**: Interactive shop between waves. Manages coins and upgrades.
- **`AchievementSystem.js`**: Tracks stats (kills, time) and unlocks trophies. Saves/Loads to `localStorage`.
- **`PauseManager.js`**: Handles in-game pause state, overlay, and transient UI.
- **`HUDManager.js`**: Manages the in-game Heads-Up Display (Health, Ammo, Score, Coins).
- **`ComboSystem.js`**: Tracks kill streaks and score multipliers.
- **`DifficultyManager.js`**: Scales enemy stats over time.
- **`SaveSystem.js`**: Generic persistence helper.

### 3. Entities (`src/entities/`)
Game Objects extending `Phaser.Physics.Arcade.Sprite`.
- **`Player.js`**: The main character. Movement, attacking, state machine (idle/run).
- **`enemies/`**:
  - Base classes and specific implementations (Goblin, Slime, Bosses).
- **`items/`**:
  - `Bottle.js`/`Coin.js`: Collectibles.
  - `Door.js`: Exit/Entry points.
- **`weapons/`**:
  - `Shield.js`, `Thunder.js`: Visual representations of attacks/buffs.

### 4. UI (`src/ui/`)
Reusable UI components.
- **`MobileControls.js`**: Virtual Joystick overlay for mobile support.
- **`Minimap.js`**: Radar/Minimap implementation.
- **`VisualEffects.js`**: Particle systems and feedback effects.

## Data Flow & Events
1.  **Input**: Handling in `Player.js` (Keyboard) or `MobileControls.js`.
2.  **State Change**: Components emit events (e.g., `enemyKilled`, `levelUp`).
3.  **Reaction**:
    - `HUDManager` listens to update UI.
    - `AchievementSystem` listens to check unlocks.
    - `WaveManager` listens to track progress.

## Global State
- **Coins/Trophies**: Persisted in `localStorage`.
- **Runtime Stats**: Reset on `Level.init()`.

## Assets
- Located in `public/assets/`.
- Loaded via `AssetLoader.js` mapping file paths to Phaser Keys.
