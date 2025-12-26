# 👾 Entities Directory

Contiene tutti gli oggetti fisici del gioco.

## Struttura

```
entities/
├── enemies/
│   ├── Enemy.js (Base class) ✅
│   ├── bosses/
│   │   ├── GiantGoblin.js (da migrare)
│   │   └── OrcBoss.js (da migrare)
│   └── [altri nemici da migrare]
├── weapons/
│   ├── Sword.js (da migrare)
│   ├── Boomerang.js (da migrare)
│   └── [altre armi da migrare]
└── items/
    ├── Bottle.js (Base class) ✅
    └── [pozioni da migrare]
```

## Responsabilità

Le entità devono SOLO:
- Gestire la propria logica interna
- Movimento e animazione
- Emettere eventi quando cambia lo stato
- NON comunicare direttamente con UI o altri sistemi

## Pattern Base

```javascript
export default class MyEntity extends Phaser.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.initProperties();
  }

  update() {
    // Solo logica interna
  }

  onStateChange() {
    // Emetti evento, non chiamare altri sistemi
    this.scene.events.emit('ENTITY_EVENT', data);
  }
}
```

## File da Migrare

### Enemies
- [ ] src/Scene/Player.js → entities/Player.js
- [ ] src/Enemies/Enemy.js → ✅ Creato nuovo
- [ ] src/Enemies/Goblin.js → entities/enemies/Goblin.js
- [ ] src/Enemies/Slime.js → entities/enemies/Slime.js
- [ ] src/Enemies/SlimeRed.js → entities/enemies/SlimeRed.js
- [ ] src/Enemies/SlimeBlue.js → entities/enemies/SlimeBlue.js
- [ ] src/Enemies/SlimeGreen.js → entities/enemies/SlimeGreen.js
- [ ] src/Enemies/SkeletonKnight.js → entities/enemies/SkeletonKnight.js
- [ ] src/Enemies/Fly.js → entities/enemies/Fly.js
- [ ] src/Enemies/RangedEnemy.js → entities/enemies/RangedEnemy.js
- [ ] src/Enemies/SpeedEnemy.js → entities/enemies/SpeedEnemy.js
- [ ] src/Enemies/TankEnemy.js → entities/enemies/TankEnemy.js
- [ ] src/Enemies/Bosses/GiantGoblin.js → entities/enemies/bosses/GiantGoblin.js
- [ ] src/Enemies/Bosses/OrcBoss.js → entities/enemies/bosses/OrcBoss.js

### Weapons
- [ ] src/Scene/Sword.js → entities/weapons/Sword.js
- [ ] src/Scene/Boomerang.js → entities/weapons/Boomerang.js
- [ ] src/Scene/Beam.js → entities/weapons/Beam.js
- [ ] src/Scene/Thunder.js → entities/weapons/Thunder.js
- [ ] src/Scene/Shotgun.js → entities/weapons/Shotgun.js
- [ ] src/Scene/Shield.js → entities/weapons/Shield.js

### Items
- [ ] src/Scene/Bottle.js → ✅ Creato nuovo
- [ ] src/Scene/RedBottle.js → entities/items/RedBottle.js
- [ ] src/Scene/BlueBottle.js → entities/items/BlueBottle.js
- [ ] src/Scene/GreenBottle.js → entities/items/GreenBottle.js
- [ ] src/Scene/YellowBottle.js → entities/items/YellowBottle.js
- [ ] src/Scene/PurpleBottle.js → entities/items/PurpleBottle.js
- [ ] src/Scene/OrangeBottle.js → entities/items/OrangeBottle.js
- [ ] src/Scene/CyanBottle.js → entities/items/CyanBottle.js
- [ ] src/Scene/Door.js → entities/items/Door.js
- [ ] src/Scene/DeathAnim.js → entities/effects/DeathAnim.js
