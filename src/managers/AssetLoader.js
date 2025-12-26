/**
 * AssetLoader.js
 * Gestisce il caricamento centralizzato di tutti gli assets del gioco
 * Seguendo il pattern Event-Driven dell'architettura
 */
export class AssetLoader {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Crea la barra di caricamento visuale
   */
  createLoadingBar() {
    const progressBar = this.scene.add.graphics();
    const progressBox = this.scene.add.graphics();
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;
    
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
    
    const loadingText = this.scene.add.text(width / 2, height / 2 - 50, 'Caricamento...', {
      font: '20px Arial',
      color: '#ffffff'
    });
    loadingText.setOrigin(0.5, 0.5);
    
    const percentText = this.scene.add.text(width / 2, height / 2, '0%', {
      font: '18px Arial',
      color: '#ffffff'
    });
    percentText.setOrigin(0.5, 0.5);
    
    const assetText = this.scene.add.text(width / 2, height / 2 + 40, '', {
      font: '12px Arial',
      color: '#cccccc'
    });
    assetText.setOrigin(0.5, 0.5);
    
    this.scene.load.on('progress', function (value) {
      progressBar.clear();
      progressBar.fillStyle(0x4CAF50, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
      percentText.setText(parseInt(value * 100) + '%');
    });
    
    this.scene.load.on('fileprogress', function (file) {
      assetText.setText('Caricamento: ' + file.key);
    });
    
    this.scene.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });
  }

  /**
   * Carica tutti gli sprites del giocatore
   */
  loadPlayerAssets() {
    this.scene.load.spritesheet("knight_idle", "assets/player/knight_idle.png", {frameWidth: 16, frameHeight: 16});
    this.scene.load.spritesheet("knight_run", "assets/player/knight_run.png", {frameWidth: 16, frameHeight: 16});
  }

  /**
   * Carica tutti gli sprites dei nemici base
   */
  loadEnemyAssets() {
    // Enemy base sprites
    this.scene.load.spritesheet("fly", "assets/enemy/fly.png", {frameWidth: 16, frameHeight: 16});
    this.scene.load.spritesheet("goblin", "assets/enemy/goblin.png", {frameWidth: 16, frameHeight: 16});
    this.scene.load.spritesheet("slime", "assets/enemy/slime.png", {frameWidth: 16, frameHeight: 16});

    // Slime Green (Slime1)
    this.scene.load.spritesheet("slime_green_idle", "assets/enemy/Slime_sprite_pack/PNG/Slime1/Without_shadow/Slime1_Idle_without_shadow.png", {frameWidth: 64, frameHeight: 64});
    this.scene.load.spritesheet("slime_green_run", "assets/enemy/Slime_sprite_pack/PNG/Slime1/Without_shadow/Slime1_Run_without_shadow.png", {frameWidth: 64, frameHeight: 64});
    this.scene.load.spritesheet("slime_green_death", "assets/enemy/Slime_sprite_pack/PNG/Slime1/Without_shadow/Slime1_Death_without_shadow.png", {frameWidth: 64, frameHeight: 64});
    
    // Slime Blue (Slime2)
    this.scene.load.spritesheet("slime_blue_idle", "assets/enemy/Slime_sprite_pack/PNG/Slime2/Without_shadow/Slime2_Idle_without_shadow.png", {frameWidth: 64, frameHeight: 64});
    this.scene.load.spritesheet("slime_blue_run", "assets/enemy/Slime_sprite_pack/PNG/Slime2/Without_shadow/Slime2_Run_without_shadow.png", {frameWidth: 64, frameHeight: 64});
    this.scene.load.spritesheet("slime_blue_death", "assets/enemy/Slime_sprite_pack/PNG/Slime2/Without_shadow/Slime2_Death_without_shadow.png", {frameWidth: 64, frameHeight: 64});
    
    // Slime Red (Slime3)
    this.scene.load.spritesheet("slime_red_idle", "assets/enemy/Slime_sprite_pack/PNG/Slime3/Without_shadow/Slime3_Idle_without_shadow.png", {frameWidth: 64, frameHeight: 64});
    this.scene.load.spritesheet("slime_red_run", "assets/enemy/Slime_sprite_pack/PNG/Slime3/Without_shadow/Slime3_Run_without_shadow.png", {frameWidth: 64, frameHeight: 64});
    this.scene.load.spritesheet("slime_red_death", "assets/enemy/Slime_sprite_pack/PNG/Slime3/Without_shadow/Slime3_Death_without_shadow.png", {frameWidth: 64, frameHeight: 64});
  }

  /**
   * Carica tutti gli sprites dei boss
   */
  loadBossAssets() {
    // Giant Goblin
    this.scene.load.spritesheet("boss_goblin_idle", "assets/bosses/Bosses_sprite/Giant Goblin/PNG/Spritesheets/Front - Idle.png", {frameWidth: 150, frameHeight: 150});
    this.scene.load.spritesheet("boss_goblin_walk", "assets/bosses/Bosses_sprite/Giant Goblin/PNG/Spritesheets/Front - Walking.png", {frameWidth: 150, frameHeight: 150});
    this.scene.load.spritesheet("boss_goblin_attack", "assets/bosses/Bosses_sprite/Giant Goblin/PNG/Spritesheets/Front - Attacking.png", {frameWidth: 150, frameHeight: 150});
    this.scene.load.spritesheet("boss_goblin_death", "assets/bosses/Bosses_sprite/Giant Goblin/PNG/Spritesheets/Dying.png", {frameWidth: 150, frameHeight: 150});
    
    // Orc Boss
    this.scene.load.spritesheet("boss_orc_idle", "assets/bosses/Orc_boss_sprite/PNG/Orc1/Without_shadow/orc1_idle_without_shadow.png", {frameWidth: 96, frameHeight: 96});
    this.scene.load.spritesheet("boss_orc_walk", "assets/bosses/Orc_boss_sprite/PNG/Orc1/Without_shadow/orc1_walk_without_shadow.png", {frameWidth: 96, frameHeight: 96});
    this.scene.load.spritesheet("boss_orc_run", "assets/bosses/Orc_boss_sprite/PNG/Orc1/Without_shadow/orc1_run_without_shadow.png", {frameWidth: 96, frameHeight: 96});
    this.scene.load.spritesheet("boss_orc_attack", "assets/bosses/Orc_boss_sprite/PNG/Orc1/Without_shadow/orc1_attack_without_shadow.png", {frameWidth: 96, frameHeight: 96});
    this.scene.load.spritesheet("boss_orc_death", "assets/bosses/Orc_boss_sprite/PNG/Orc1/Without_shadow/orc1_death_without_shadow.png", {frameWidth: 96, frameHeight: 96});
  }

  /**
   * Carica armi e pozioni
   */
  loadItemAssets() {
    // Weapons
    this.scene.load.spritesheet("sword", "assets/player/sword.png", {frameWidth: 16, frameHeight: 16});
    this.scene.load.spritesheet("laser", "assets/player/laser.png", {frameWidth: 16, frameHeight: 16});

    // Potions
    this.scene.load.spritesheet("potion", "assets/potions/red_potion.png", {frameWidth: 16, frameHeight: 16});
    this.scene.load.spritesheet("yellow_potion", "assets/potions/yellow_potion.png", {frameWidth: 16, frameHeight: 16});
    this.scene.load.spritesheet("blue_potion", "assets/potions/azure_potion.png", {frameWidth: 16, frameHeight: 16});
    this.scene.load.spritesheet("green_potion", "assets/potions/green_potion.png", {frameWidth: 16, frameHeight: 16});
    this.scene.load.spritesheet("purple_potion", "assets/potions/purple_potion.png", {frameWidth: 16, frameHeight: 16});
  }

  /**
   * Carica effetti visivi
   */
  loadEffectAssets() {
    this.scene.load.spritesheet("death", "assets/enemy/explosion-6.png", {frameWidth: 48, frameHeight: 48});
    this.scene.load.spritesheet("thunder", "assets/enemy/electro_ray.png", {frameWidth: 64, frameHeight: 64});
    this.scene.load.spritesheet("shield1", "assets/player/shield1.png", {frameWidth: 64, frameHeight: 64});
  }

  /**
   * Carica mappa e UI assets
   */
  loadMapAndUI() {
    this.scene.load.spritesheet("door", "assets/door.png", { frameWidth: 32, frameHeight: 32 });
    this.scene.load.tilemapTiledJSON("tilemap", "assets/Map.json");
    this.scene.load.image("shooter", "assets/tilesheet.png");
    this.scene.load.image("pause_btn", "assets/pauseBtn.png");
  }

  /**
   * Carica tutti gli assets del gioco
   */
  loadAll() {
    this.createLoadingBar();
    this.loadPlayerAssets();
    this.loadEnemyAssets();
    this.loadBossAssets();
    this.loadItemAssets();
    this.loadEffectAssets();
    this.loadMapAndUI();
  }
}
