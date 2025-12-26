# 🎮 KNIGHT SHOOTER

> **Versione:** 1.2.0  
> **Framework:** Phaser 3.80.1 | Vite 5.2.0  
> **Tipo:** 2D Top-Down Shooter / Survival  
> **Ultimo Aggiornamento:** 26 Dicembre 2025

---

## 🎯 Il Gioco

Un **survival shooter 2D** dove controlli un cavaliere che deve sopravvivere a ondate infinite di nemici. Raccogli pozioni per power-up temporanei, sali di livello, sblocca achievement e affronta i boss!

### Controlli
| Tasto | Azione |
|-------|--------|
| **WASD** | Movimento |
| **Mouse Click** | Attacca |
| **ESC / P** | Pausa |

---

## ⚔️ Nemici

### Base
| Nemico | HP | Danno | Comportamento |
|--------|-----|-------|---------------|
| 🟢 Slime Green | 40 | 20 | Standard, segue il player |
| 🔵 Slime Blue | 50 | 25 | Più resistente, leggermente più lento |
| 🔴 Slime Red | 30 | 30 | Aggressivo, più veloce |
| 🪰 Fly | 25 | 15 | Veloce, movimento erratico |
| 👺 Goblin | 60 | 25 | Resistente |
| 🛡️ Tank | 150 | 40 | Lento ma devastante |
| ⚡ Speed | 15 | 10 | Velocissimo, zigzag |
| 🏹 Ranged | 35 | 15 | Spara proiettili, mantiene distanza |
| 💀 Skeleton | 80 | 35 | Wave avanzate |

### Boss (ogni 10 wave)
| Boss | HP | Danno | Speciale |
|------|-----|-------|----------|
| 👹 Giant Goblin | 500 | 50 | Grande, attacchi ad area |
| 🧌 Orc Boss | 750 | 60 | Molto resistente, carica |

---

## 🧪 Pozioni

| Colore | Effetto | Durata |
|--------|---------|--------|
| 🔴 Rossa | +200 HP | Istantaneo |
| 🟡 Gialla | Arma Laser | 10s |
| 🔵 Blu | Scudo Invincibilità | 7s |
| 🟢 Verde | +50% Velocità | 5s |
| 🟣 Viola | Fulmine (uccide tutti) | Istantaneo |
| 🟠 Arancione | Shotgun (3 colpi) | 10s |
| 🩵 Cyan | Boomerang | 10s |

---

## 📊 Sistemi di Gioco

### Wave System
- **Wave 1-3:** Solo Slime Green
- **Wave 4-6:** Slime (tutti i tipi) + Fly
- **Wave 7-9:** + Goblin
- **Wave 10:** 🔥 **BOSS: Giant Goblin**
- **Wave 11-14:** + Speed Enemy + Ranged
- **Wave 15-19:** + Tank + Skeleton
- **Wave 20:** 🔥 **BOSS: Orc**
- **Wave 21+:** Tutti i nemici, difficoltà crescente

### XP & Level Up
- Ogni nemico ucciso dà XP
- Level up = +10 HP max, +5% danno
- Moltiplicatore combo: fino a x5

### Achievement (16 totali)
- Sblocca obiettivi per XP bonus
- Popup discreti in basso a destra

---

## 📁 Struttura Progetto

```
├── src/
│   ├── Level.js          # Scena gameplay principale
│   ├── MainMenu.js       # Menu iniziale
│   ├── GameOver.js       # Schermata fine
│   ├── AudioManager.js   # Gestione audio
│   ├── WaveManager.js    # Sistema ondate
│   ├── ComboSystem.js    # Combo uccisioni
│   ├── AchievementSystem.js
│   ├── DifficultyManager.js
│   ├── Minimap.js
│   ├── VisualEffects.js
│   │
│   ├── Enemies/          # Classi nemici
│   │   ├── Enemy.js      # Classe base
│   │   ├── Slime.js
│   │   ├── SlimeGreen.js
│   │   ├── SlimeBlue.js
│   │   ├── SlimeRed.js
│   │   ├── Goblin.js
│   │   ├── Fly.js
│   │   ├── TankEnemy.js
│   │   ├── SpeedEnemy.js
│   │   ├── RangedEnemy.js
│   │   ├── SkeletonKnight.js
│   │   └── Bosses/
│   │       ├── GiantGoblin.js
│   │       └── OrcBoss.js
│   │
│   └── Scene/            # Oggetti gameplay
│       ├── Player.js
│       ├── Sword.js, Beam.js
│       ├── Shotgun.js, Boomerang.js
│       ├── Shield.js, Thunder.js
│       └── Bottles (Red, Yellow, Blue, Green, Purple, Orange, Cyan)
│
├── assets/
│   ├── audio/            # 🎵 File audio
│   │   ├── Main_theme.mp3
│   │   ├── Boss_theme.mp3
│   │   └── Menu_audio.wav
│   │
│   ├── player/           # Sprite giocatore
│   ├── potions/          # Sprite pozioni
│   │
│   ├── enemy/            # Sprite nemici
│   │   ├── Slime_sprite_pack/   # 3 tipi di slime animati
│   │   ├── Skeleton_knight_sprite/
│   │   └── Random_enemy_sprite/
│   │
│   └── bosses/           # Sprite boss
│       ├── Bosses_sprite/Giant Goblin/
│       └── Orc_boss_sprite/
```

---

## 🎵 Audio

| File | Utilizzo |
|------|----------|
| `Menu_audio.wav` | Menu principale |
| `Main_theme.mp3` | Durante il gameplay |
| `Boss_theme.mp3` | Durante boss fight |

---

## 🚀 Avvio

```bash
npm install
npm run dev
```

---

## 📝 Changelog

### v1.2.0 (26 Dicembre 2025)
- ✅ 3 nuovi tipi di Slime con sprite animati
- ✅ Boss system: Giant Goblin e Orc ogni 10 wave
- ✅ Skeleton Knight enemy
- ✅ Integrazione audio (menu, gameplay, boss)
- ✅ README completamente ristrutturato

### v1.1.0 (26 Dicembre 2025)
- Sistema Wave progressivo
- Sistema XP/Level
- 3 nuovi nemici (Tank, Speed, Ranged)
- 2 nuove armi (Shotgun, Boomerang)
- Sistema Combo e Achievement
- Mini-mappa e effetti visivi
- Bugfix: velocità player, achievement, spawn armi

### v1.0.0
- Release iniziale
- 3 nemici base (Slime, Fly, Goblin)
- 5 pozioni
- Sistema HP funzionante
- Menu e Game Over

---

## 🔮 Idee Future

- [ ] Modalità multiplayer locale
- [ ] Power-up permanenti (shop tra wave)
- [ ] Mappa procedurale
- [ ] Classifica online
- [ ] Mobile touch controls
