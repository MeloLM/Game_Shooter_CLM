# 🎮 KNIGHT SHOOTER

> **Versione:** 1.7.0  
> **Framework:** Phaser 3.80.1 | Vite 5.2.0  
> **Tipo:** 2D Top-Down Shooter / Survival  
> **Ultimo Aggiornamento:** 26 dicembre 2025

Un gioco survival shooter 2D dove controlli un cavaliere che deve sopravvivere a ondate infinite di nemici, raccogliere power-up e sconfiggere boss epici!

---

## 📋 CHANGELOG v1.7.0

### 📱 Mobile Support & Settings
- ✅ **Mobile Controls**: Frecce direzionali touch per dispositivi mobile
- ✅ **Settings Menu**: Nuova schermata impostazioni accessibile dal menu principale
  - Bottone "MENU" in alto a sinistra per tornare al menu principale
  - UI compatta e ben organizzata
- ✅ **Toggle Mobile Controls**: Abilita/disabilita controlli touch nelle impostazioni
- ✅ **Toggle Music/SFX**: Controllo audio separato per musica e effetti
- ✅ **Toggle Particles**: Opzione per disabilitare particelle (performance)

### ⚡ Performance Optimizations
- ✅ **Loading Bar**: Barra di caricamento durante il preload degli assets
- ✅ **Minimap Optimized**: Aggiornamento ogni 3 frame invece che ogni frame
- ✅ **Particles Toggle**: Gli effetti particelle rispettano le impostazioni utente
- ✅ **AudioContext Fix**: Risolto warning browser per autoplay audio

### 🔧 Code Quality
- ✅ **Settings Persistence**: Impostazioni salvate in localStorage
- ✅ **AudioManager Settings**: Musica rispetta impostazioni utente
- ✅ **VisualEffects Settings**: Particelle rispettano impostazioni utente
- ✅ **Console.log Cleanup**: Rimossi log di debug rimanenti
- ✅ **UI/UX Improvements**: Bottone menu posizionato strategicamente in alto a sinistra

### Nuovi File
- `src/Settings.js` - Schermata impostazioni con UI migliorata
- `src/MobileControls.js` - Controlli touch per mobile

---

## 📋 CHANGELOG v1.6.0

### Code Cleanup & Optimization
- ✅ **UI Layout Fix**: Risolte sovrapposizioni testo (Trophy y:30, Difficulty y:50, Combo y:62)
- ✅ **Trofei Persistenti**: I trofei ora si salvano in localStorage permanentemente
- ✅ **Import Cleanup**: Rimossi import inutilizzati (Slime, Shotgun da Level.js)
- ✅ **Console.log Cleanup**: Rimossi tutti i log di debug
- ✅ **Package.json**: Aggiornato con nome, versione, descrizione, keywords
- ✅ **Hitbox Slime Fix**: Tutti gli slime hanno hitbox 20x16 centrata sullo sprite

### Layout UI Gameplay (sinistra, dall'alto)
```
💀 Score          (y: 5)   - HUD superiore
🏆 0/16           (y: 30)  - Trofei partita
🗡️ progress      (y: 40)  - Prossimo trofeo  
⚔️ Difficoltà    (y: 50)  - Livello difficoltà
🔥 Combo x2       (y: 62)  - Solo quando attivo
x points          (y: 75)  - Moltiplicatore
[===]             (y: 86)  - Timer combo
```

---

## 📋 CHANGELOG v1.5.0

### New Features
- ✅ **Trophy Screen**: Nuova schermata dedicata ai trofei accessibile dal menu principale
- ✅ **Hitbox uniformate**: Tutti i nemici ora hanno hitbox ridotte e centrate

---

## 🎯 Caratteristiche Principali

- 🎮 **Gameplay Dinamico**: Sistema di wave con difficoltà crescente
- ⚔️ **Varietà Nemici**: 11 tipi di nemici + 2 boss epici
- 🧪 **Power-ups**: 7 pozioni con effetti diversi
- 🔫 **Armi Multiple**: Spada, Laser, Shotgun, Boomerang
- 🏆 **Achievement**: 16 trofei sbloccabili
- 📊 **Sistema Combo**: Moltiplicatori fino a x5.0
- 📱 **Mobile Support**: Controlli touch per dispositivi mobili
- 🎵 **Audio Completo**: Musica dinamica e effetti sonori

---

## 🎮 Come Giocare

### Controlli Desktop
| Tasto | Azione |
|-------|--------|
| **WASD** | Movimento |
| **Mouse Click** | Attacca |
| **ESC / P** | Pausa |

### Controlli Mobile
| Controllo | Azione |
|-----------|--------|
| **D-Pad** | Movimento (frecce direzionali) |
| **⚔️ Button** | Attacca |

> 💡 I controlli touch sono abilitabili da **Impostazioni** nel menu principale

---

## 🚀 Avvio Rapido

```bash
# Clona il repository
git clone https://github.com/tuousername/Knight-Shooter.git

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Build per produzione
npm run build
```

Apri [http://localhost:5173](http://localhost:5173) nel browser per giocare!

---

---

## 🏗️ Architettura del Progetto

Il progetto segue un'architettura **Event-Driven Modular** per garantire manutenibilità e scalabilità.

### 📁 Struttura Directory

```
src/
├── scenes/              # Scene di gioco Phaser
│   ├── Level.js        # Scena gameplay principale
│   ├── MainMenu.js     # Menu principale
│   ├── GameOver.js     # Schermata game over
│   ├── Settings.js     # Menu impostazioni
│   └── TrophyScreen.js # Schermata trofei
│
├── entities/           # Entità di gioco
│   ├── Player.js       # Giocatore
│   ├── enemies/        # Nemici
│   ├── weapons/        # Armi
│   ├── items/          # Oggetti/Power-ups
│   └── effects/        # Effetti visivi
│
├── managers/           # Manager di sistema
│   ├── WaveManager.js
│   ├── AudioManager.js
│   ├── CollisionManager.js
│   ├── AchievementSystem.js
│   └── ...
│
├── ui/                 # Componenti UI
│   ├── HUDManager.js
│   ├── Minimap.js
│   └── ...
│
└── utils/              # Utility e configurazioni
    └── EntityFactories.js
```

### 🎯 Pattern Architetturali

- **Separation of Concerns**: Ogni file ha una singola responsabilità
- **Event-Driven**: Comunicazione tra componenti tramite eventi
- **Factory Pattern**: Creazione centralizzata di entità
- **Manager Pattern**: Logica di gioco delegata a manager specializzati

---

## 🎮 Sistemi di Gioco

### ⚔️ Nemici (11 Tipi)

| Nemico | HP | Danno | Velocità | Note |
|--------|-----|-------|----------|------|
| Slime Verde | 40 | 20 | 40 | Nemico base |
| Slime Blu | 50 | 25 | 30 | Tank |
| Slime Rosso | 30 | 30 | 55 | Veloce |
| Fly | 25 | 15 | 60 | Movimento erratico |
| Goblin | 60 | 25 | 35 | Resistente |
| Tank | 150 | 40 | 20 | Molto HP |
| Speed | 15 | 10 | 100 | Velocissimo |
| Ranged | 35 | 15 | 25 | Attacchi a distanza |

### 🐉 Boss

| Boss | HP | Wave | Ricompensa XP |
|------|-----|------|---------------|
| Giant Goblin | 500 | 10, 30, 50... | 200 |
| Orc Boss | 750 | 20, 40, 60... | 350 |

### 🧪 Power-ups (7 Pozioni)

| Pozione | Effetto | Durata |
|---------|---------|--------|
| 🔴 Rossa | +200 HP | Istantaneo |
| 🟡 Gialla | Laser | 10s |
| 🔵 Blu | Scudo Invincibilità | 7s |
| 🟢 Verde | +50% Velocità | 5s |
| 🟣 Viola | Thunder AoE | Istantaneo |
| 🟠 Arancione | Shotgun | 10s |
| 🩵 Cyan | Boomerang | 10s |

### 🔥 Sistema Combo

| Combo | Moltiplicatore | Colore |
|-------|----------------|--------|
| 0-2 | x1.0 | Bianco |
| 3-4 | x1.5 | Giallo |
| 5-9 | x2.0 | Arancione |
| 10-14 | x2.5 | Rosso scuro |
| 15-24 | x3.0 | Rosso |
| 25-49 | x4.0 | Viola |
| 50+ | x5.0 | Cyan |

---

## 📝 CHANGELOG

### v1.7.0 (26 Dicembre 2025) - Refactoring Architetturale
- ✅ **Refactoring Level.js**: Ridotto da 957 a 482 linee
- ✅ **Nuovi Manager**: AssetLoader, CollisionManager, PauseManager, HUDManager
- ✅ **Architecture Pattern**: Event-Driven Modular completamente implementato
- ✅ **Mobile Support**: Controlli touch per dispositivi mobile
- ✅ **Settings Menu**: Menu impostazioni completo
- ✅ **Performance**: Ottimizzazioni minimap e particelle

### v1.6.0 (26 Dicembre 2025)
- ✅ UI Layout ottimizzato
- ✅ Trofei persistenti in localStorage
- ✅ Cleanup import e console.log
- ✅ Hitbox uniformate per tutti i nemici

### v1.5.0 (26 Dicembre 2025)
- ✅ Trophy Screen dedicata
- ✅ Hitbox nemici centrate

### v1.3.0 (26 Dicembre 2025)
- ✅ Pannello Trofei nel menu
- 🐛 Fix: Animazioni boss
- 🐛 Fix: Boss AI

### v1.2.0 (26 Dicembre 2025)
- ✅ 3 nuovi Slime con sprite animati
- ✅ Sistema Boss (Giant Goblin, Orc)
- ✅ Sistema audio completo

### v1.0.0
- Release iniziale

---

---

## 🚀 Deploy

### Build Locale

```bash
# Testa la build
npm run build

# Anteprima (http://localhost:4173)
npm run preview
```

### Deploy su Vercel

1. Vai su [vercel.com](https://vercel.com) e accedi con GitHub
2. Importa il repository
3. Vercel rileverà automaticamente le impostazioni Vite
4. Deploy automatico ad ogni push su GitHub

---

## 🤝 Contribuire

Contributi, issue e feature request sono benvenuti! Sentiti libero di aprire una issue o una pull request.

---

## 📝 Licenza

Questo progetto è open source e disponibile sotto la [MIT License](LICENSE).

---

## 🙏 Crediti

- **Framework**: [Phaser 3](https://phaser.io/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Sprite Assets**: [Craftpix.net](https://craftpix.net/)

---

**Sviluppato con ❤️ usando Phaser 3 e Vite**
