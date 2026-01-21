# TODO - Knight Shooter

> **Last Update:** 2026-01-19  
> **Status:** Stable - UI Unified

---

## Completed Features

### Core Systems
- [x] EventBus centralizzato
- [x] Save System (highscores, settings, achievements)
- [x] Object Pooling for performance
- [x] Coin & Shop System
- [x] Achievement System (16 trophies)
- [x] Screen Shake effects
- [x] Particle System

### Enemies
- [x] Base enemies (Slime, Goblin, Fly, Tank, Speed, Ranged)
- [x] Skeleton Knight
- [x] Assassin (invisibility mechanic)
- [x] Bosses (Orc, Viking, Caveman, Goblin)

### Power-ups
- [x] All potion types (HP, Speed, Damage, Shield, etc.)
- [x] Frenzy Mode (WhiteBottle)
- [x] Magnet (PinkBottle)

### UI/UX
- [x] Unified font (Verdana)
- [x] Minimalist white buttons style
- [x] Clean HUD layout
- [x] English localization
- [x] Removed excessive animations (coin shimmer, etc.)

---

## Current Priorities

### High Priority
- [ ] Balance testing (enemy spawn rates, damage values)
- [ ] Audio system completion (BGM + SFX)

### Medium Priority
- [ ] New enemy: Necromancer (summons minions)
- [ ] New weapons (Bow, Hammer)
- [ ] Mobile touch controls optimization

### Low Priority
- [ ] Online leaderboard
- [ ] PWA support
- [ ] Additional maps/levels

---

## Asset Status

| Asset | Path | Status |
|-------|------|--------|
| coin.png | assets/items/ | Ready |
| white_potion.png | assets/potions/ | Ready |
| pink_potion.png | assets/potions/ | Ready |
| purple_potion.png | assets/potions/ | Ready |

---

## Project Structure

```
src/
├── scenes/         OK
├── entities/
│   ├── enemies/    OK
│   │   └── bosses/ OK
│   ├── weapons/    OK
│   ├── items/      OK
│   └── effects/    OK
├── managers/       OK
├── ui/             OK
└── utils/          OK
```

---

## Future Ideas

- [ ] More maps (forest, dungeon, castle themes)
- [ ] New weapons (Bow, Hammer, Elemental magic)
- [ ] Necromancer enemy (summons minions)
- [ ] Daily challenges
- [ ] Player skin unlockables
- [ ] Boss Rush mode
