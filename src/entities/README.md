# 👾 Entities Directory

Contiene tutti gli oggetti fisici del gioco.

## Struttura Attuale

```
entities/
├── Player.js              # Giocatore principale ✅
├── enemies/
│   ├── Enemy.js           # Base class per nemici ✅
│   ├── Assassin.js        # Nemico con stealth ✅ NEW
│   ├── Fly.js             # Nemico volante veloce ✅
│   ├── Goblin.js          # Nemico base ✅
│   ├── RangedEnemy.js     # Nemico a distanza ✅
│   ├── SkeletonKnight.js  # Nemico corazzato ✅
│   ├── Slime.js           # Slime base ✅
│   ├── SlimeBlue.js       # Variante slime ✅
│   ├── SlimeGreen.js      # Variante slime ✅
│   ├── SlimeRed.js        # Variante slime ✅
│   ├── SpeedEnemy.js      # Nemico veloce ✅
│   ├── TankEnemy.js       # Nemico resistente ✅
│   └── bosses/
│       ├── GiantGoblin.js # Boss Goblin ✅
│       └── OrcBoss.js     # Boss Orc ✅
├── weapons/
│   ├── Beam.js            # Laser ✅
│   ├── Boomerang.js       # Arma che torna ✅
│   ├── Shield.js          # Scudo protettivo ✅
│   ├── Shotgun.js         # Sparo multiplo ✅
│   ├── Sword.js           # Attacco base ✅
│   └── Thunder.js         # Fulmine AoE ✅
├── items/
│   ├── Bottle.js          # Base class ✅
│   ├── Coin.js            # Moneta per shop ✅ NEW
│   ├── Door.js            # Porta ingresso ✅
│   ├── RedBottle.js       # Heal ✅
│   ├── BlueBottle.js      # Shield ✅
│   ├── GreenBottle.js     # Speed ✅
│   ├── YellowBottle.js    # Laser ✅
│   ├── PurpleBottle.js    # Thunder ✅
│   ├── OrangeBottle.js    # Shotgun ✅
│   ├── CyanBottle.js      # Boomerang ✅
│   ├── WhiteBottle.js     # Frenzy Mode ✅ NEW
│   └── PinkBottle.js      # Magnet ✅ NEW
└── effects/
    └── DeathAnim.js       # Animazione morte ✅
```

## Responsabilità

Le entità devono SOLO:
- ✅ Gestire la propria logica interna
- ✅ Movimento e animazione
- ✅ Emettere eventi quando cambia lo stato
- ❌ NON comunicare direttamente con UI o altri sistemi

## Pattern Base

```javascript
import { Physics } from 'phaser';

export class MyEntity extends Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  update() {
    // Solo logica interna
  }

  takeDamage(amount) {
    this.health -= amount;
    // Emetti evento, non chiamare altri sistemi
    this.scene.events.emit('ENTITY_DAMAGED', { entity: this, amount });
  }
}
```
