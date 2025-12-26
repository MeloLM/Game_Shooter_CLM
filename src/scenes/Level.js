/**
 * Level.js - Scene principale di gameplay (ORCHESTRATOR)
 * Delega la logica ai Manager seguendo l'architettura Event-Driven
 */
import { Scene } from "phaser";
import { Player } from "../entities/Player.js";
import { GiantGoblin } from "../entities/enemies/bosses/GiantGoblin.js";
import { OrcBoss } from "../entities/enemies/bosses/OrcBoss.js";
import { Door } from "../entities/items/Door.js";
import { Shield } from "../entities/weapons/Shield.js";

// Managers
import { WaveManager } from "../managers/WaveManager.js";
import { ComboSystem } from "../managers/ComboSystem.js";
import { AchievementSystem } from "../managers/AchievementSystem.js";
import { DifficultyManager } from "../managers/DifficultyManager.js";
import { AudioManager } from "../managers/AudioManager.js";
import { AssetLoader } from "../managers/AssetLoader.js";
import { PauseManager } from "../managers/PauseManager.js";
import { CollisionManager } from "../managers/CollisionManager.js";

// UI
import { Minimap } from "../ui/Minimap.js";
import { VisualEffects } from "../ui/VisualEffects.js";
import { MobileControls } from "../ui/MobileControls.js";
import { HUDManager } from "../ui/HUDManager.js";

// Utils
import { createEnemyFactories, createBottleFactories } from "../utils/EntityFactories.js";

export class Level extends Scene {
  constructor() {
    super({ key: 'Level' });
  }

  // === GAME STATE ===
  startAnimation = true;
  targetPosStartAnimation = 64;
  door = null;
  player = null;
  enemies = [];
  bottles = [];
  attacks = [];
  boomerangs = [];
  immunity = false;
  immuneDuration = 7000;
  lastCollisionTime = 0;
  shield = null;
  enemyCounter = 0;
  totalScore = 0;
  potionsCollected = 0;
  survivalTime = 0;
  startTime = 0;
  slimeKills = 0;
  lastAchievementCheck = 0;
  useWaveSystem = true;

  // === MANAGERS ===
  audioManager = null;
  waveManager = null;
  comboSystem = null;
  achievementSystem = null;
  difficultyManager = null;
  pauseManager = null;
  collisionManager = null;
  assetLoader = null;
  hudManager = null;
  
  // === UI ===
  minimap = null;
  visualEffects = null;
  mobileControls = null;

  // === ENTITY FACTORIES (inizializzate in init) ===
  enemiesList = [];
  bottleWeights = [];

  /**
   * Inizializza lo stato del livello
   */
  init() {
    this.startAnimation = true;
    this.player = null;
    this.enemies = [];
    this.attacks = [];
    this.bottles = [];
    this.boomerangs = [];
    this.survivalTime = 0;
    this.startTime = 0;
    this.enemyCounter = 0;
    this.totalScore = 0;
    this.potionsCollected = 0;
    this.slimeKills = 0;
    this.lastAchievementCheck = 0;
    
    // Init factories
    this.enemiesList = createEnemyFactories(this);
    this.bottleWeights = createBottleFactories(this);
    
    // Reset managers
    this.waveManager = null;
    this.comboSystem = null;
    this.minimap = null;
    this.visualEffects = null;
    this.achievementSystem = null;
    this.difficultyManager = null;
    this.mobileControls = null;
    this.pauseManager = null;
    this.collisionManager = null;
    this.hudManager = null;
  }

  /**
   * Preload assets tramite AssetLoader
   */
  preload() {
    this.assetLoader = new AssetLoader(this);
    this.assetLoader.loadAll();
    
    // Audio preload separato (ha logica specifica)
    this.audioManager = new AudioManager(this);
    this.audioManager.preloadSounds();
  }

  /**
   * Costruisce il livello
   */
  create() {
    this.startTime = this.time.now;
    
    // === MAP ===
    this.setupMap();
    
    // === AUDIO ===
    this.audioManager.initSounds();
    this.audioManager.playBGM();

    // === MANAGERS ===
    this.initManagers();
    
    // === ENTITIES ===
    this.createEntities();
    
    // === SPAWNERS ===
    this.setupSpawners();
    
    // === PHYSICS ===
    this.setupPhysics();
    
    // === CAMERA ===
    this.cameras.main.startFollow(this.player).setZoom(1).setBounds(10, 5, 620, 344);
  }

  /**
   * Setup della mappa
   */
  setupMap() {
    this.map = this.make.tilemap({ key: "tilemap" });
    this.map.addTilesetImage("shooter");
    this.map.createLayer("Floor", "shooter");
    this.wallLayer = this.map.createLayer("Walls", "shooter");
    this.wallLayer.setCollisionBetween(1, this.wallLayer.tilesTotal);
    this.map.createLayer("Decorations", "shooter");
  }

  /**
   * Inizializza tutti i manager
   */
  initManagers() {
    const hudDepth = this.wallLayer.depth + 10;
    
    // HUD Manager
    this.hudManager = new HUDManager(this);
    this.hudManager.create(hudDepth);
    
    // Pause Manager
    this.pauseManager = new PauseManager(this);
    this.pauseManager.create();
    
    // Collision Manager
    this.collisionManager = new CollisionManager(this);
    
    // Combo System
    this.comboSystem = new ComboSystem(this);
    
    // Minimap
    this.minimap = new Minimap(this, 640, 360);
    
    // Visual Effects
    this.visualEffects = new VisualEffects(this);
    
    // Achievement System
    this.achievementSystem = new AchievementSystem(this);
    
    // Difficulty Manager
    this.difficultyManager = new DifficultyManager(this);
  }

  /**
   * Crea le entità di gioco
   */
  createEntities() {
    // Player
    this.player = new Player(this, 320, 0, "player_idle");
    this.player.setOrigin(0.5, 0.5);
    this.player.setBodySize(8, 10);
    
    // Mobile Controls
    this.mobileControls = new MobileControls(this, this.player);
    
    // Door
    this.door = new Door(this, 320, 16, "door");
    
    // Shield
    this.shield = new Shield(this, this.player.x, this.player.y, "shield1");
    this.updateShieldVisibility();
    this.shield.play("shield");
  }

  /**
   * Setup spawner per bottiglie e wave
   */
  setupSpawners() {
    // Bottle spawner
    this.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => this.spawnBottle()
    });

    // Wave system
    if (this.useWaveSystem) {
      this.waveManager = new WaveManager(this);
      this.time.delayedCall(2000, () => this.waveManager.start());
    } else {
      this.setupLegacySpawner();
    }
  }

  /**
   * Spawn di una bottiglia casuale
   */
  spawnBottle() {
    const totalWeight = this.bottleWeights.reduce((sum, b) => sum + b.weight, 0);
    let random = Phaser.Math.Between(1, totalWeight);
    let selectedBottle = null;
    
    for (const bottleConfig of this.bottleWeights) {
      random -= bottleConfig.weight;
      if (random <= 0) {
        selectedBottle = bottleConfig;
        break;
      }
    }

    const x = Phaser.Math.Between(0, this.map.widthInPixels);
    const y = Phaser.Math.Between(0, this.map.heightInPixels - 30);

    if (!this.wallLayer.getTileAtWorldXY(x, y) && selectedBottle) {
      const bottle = selectedBottle.create(x, y);
      this.bottles = [...this.bottles, bottle];
    }
  }

  /**
   * Legacy spawner per nemici (senza wave)
   */
  setupLegacySpawner() {
    this.time.addEvent({
      delay: 200,
      loop: true,
      callback: () => {
        const x = Phaser.Math.Between(0, 640);
        const y = Phaser.Math.Between(0, 360);
        if (!this.cameras.main.getBounds().contains(x, y)) {
          const enemy = this.enemiesList[Phaser.Math.Between(0, 2)](x, y);
          this.enemies = [...this.enemies, enemy];
        }
      }
    });
  }

  /**
   * Setup delle collisioni fisiche
   */
  setupPhysics() {
    this.physics.add.collider(this.player, this.wallLayer);
    this.physics.add.collider(this.player, this.door);
    this.physics.add.collider(this.player, this.bottle);
  }

  /**
   * Game loop principale
   */
  update() {
    // Check pausa
    if (this.pauseManager && this.pauseManager.getIsPaused()) {
      return;
    }

    // Start animation
    if (this.startAnimation) {
      this.handleStartAnimation();
      return;
    }

    // Mobile controls
    this.handleMobileControls();

    // Update enemies
    this.updateEnemies();

    // Check immunity
    this.checkImmunity();

    // Collisions (delegato al manager)
    this.collisionManager.setupCollisions();

    // Shield position
    if (this.shield) {
      this.shield.updatePosition(this.player.x, this.player.y);
    }

    // Update systems
    this.updateSystems();
  }

  /**
   * Gestisce l'animazione iniziale
   */
  handleStartAnimation() {
    this.physics.moveTo(this.player, this.player.x, this.targetPosStartAnimation, this.player.speed);
    if (this.player.y >= this.targetPosStartAnimation) {
      this.player.setVelocity(0);
      this.startAnimation = false;
      this.player.play("idle");
      this.door.play("door");
    }
  }

  /**
   * Gestisce i controlli mobile
   */
  handleMobileControls() {
    if (this.mobileControls && this.mobileControls.enabled) {
      const move = this.mobileControls.getMovement();
      if (move.x !== 0 || move.y !== 0) {
        this.player.setVelocityX(move.x * this.player.speed);
        this.player.setVelocityY(move.y * this.player.speed);
        this.player.updateAnimation();
        if (move.x < 0) this.player.setFlipX(true);
        else if (move.x > 0) this.player.setFlipX(false);
      }
    }
  }

  /**
   * Update di tutti i nemici
   */
  updateEnemies() {
    this.enemies.forEach((enemy) => {
      if (enemy.update && typeof enemy.update === 'function') {
        enemy.update(this.player);
      } else {
        this.physics.moveToObject(enemy, this.player, enemy.moveSpeed || 40);
      }
      
      // Bounds check
      enemy.x = Phaser.Math.Clamp(enemy.x, 10, 630);
      enemy.y = Phaser.Math.Clamp(enemy.y, 10, 350);
      
      // Flip based on player position
      enemy.setFlipX(enemy.x > this.player.x);
    });
  }

  /**
   * Check scadenza immunità
   */
  checkImmunity() {
    if (this.immunity && this.time.now > this.lastCollisionTime + this.immuneDuration) {
      this.immunity = false;
    }
  }

  /**
   * Update di tutti i sistemi secondari
   */
  updateSystems() {
    this.updateShieldVisibility();
    this.player.updateHPBar();
    
    // Enemy HP bars
    this.enemies.forEach((enemy) => {
      if (enemy.updateHPBar) enemy.updateHPBar();
    });
    
    // Boomerangs
    this.boomerangs.forEach((b) => {
      if (b && b.active && b.update) b.update();
    });
    this.boomerangs = this.boomerangs.filter(b => b && b.active);
    
    // Minimap
    if (this.minimap) this.minimap.update();
    
    // Visual Effects
    if (this.visualEffects) this.visualEffects.update();
    
    // Achievements (ogni secondo)
    if (this.achievementSystem && Math.floor(this.time.now / 1000) !== this.lastAchievementCheck) {
      this.lastAchievementCheck = Math.floor(this.time.now / 1000);
      const stats = AchievementSystem.getStatsFromScene(this);
      this.achievementSystem.checkAchievements(stats);
      this.achievementSystem.updateTrophyUI();
    }
    
    // Difficulty
    if (this.difficultyManager) {
      const elapsed = (this.time.now - this.startTime) / 1000;
      this.difficultyManager.update(elapsed, this.enemyCounter);
    }
    
    // HUD
    if (this.hudManager) {
      this.hudManager.update({
        enemyCounter: this.enemyCounter,
        startTime: this.startTime,
        player: this.player
      });
    }
  }

  /**
   * Aggiorna visibilità dello scudo
   */
  updateShieldVisibility() {
    if (this.shield) {
      this.shield.setVisible(this.immunity);
    }
  }

  /**
   * Crea un boss del tipo specificato
   */
  createBoss(type, x, y) {
    switch (type) {
      case 'goblin': return new GiantGoblin(this, x, y);
      case 'orc': return new OrcBoss(this, x, y);
      default: return new GiantGoblin(this, x, y);
    }
  }

  // === RETROCOMPATIBILITÀ ===
  // Metodi mantenuti per compatibilità con altri sistemi
  
  get isPaused() {
    return this.pauseManager ? this.pauseManager.getIsPaused() : false;
  }

  get scoreText() {
    return this.hudManager ? this.hudManager.getScoreText() : null;
  }

  togglePause() {
    if (this.pauseManager) {
      this.pauseManager.toggle();
    }
  }

  showDamageFlash() {
    if (this.hudManager) {
      this.hudManager.showDamageFlash();
    }
  }

  showPickupEffect(x, y, color) {
    if (this.hudManager) {
      this.hudManager.showPickupEffect(x, y, color);
    }
  }
}
