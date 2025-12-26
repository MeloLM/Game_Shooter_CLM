import { Scene, Text } from "phaser";
import { Player } from "./Scene/Player.js";
import { Fly } from "./Enemies/Fly.js";
import { Goblin } from "./Enemies/Goblin.js";
import { Slime } from "./Enemies/Slime.js";
import { TankEnemy } from "./Enemies/TankEnemy.js";
import { SpeedEnemy } from "./Enemies/SpeedEnemy.js";
import { RangedEnemy } from "./Enemies/RangedEnemy.js";
import { Door } from "./Scene/Door.js";
import { DeathAnim } from "./Scene/DeathAnim.js";
import { RedBottle } from "./Scene/RedBottle.js";
import { YellowBottle } from "./Scene/YellowBottle.js";
import { BlueBottle } from "./Scene/BlueBottle.js";
import { Shield } from "./Scene/Shield.js";
import { GreenBottle } from "./Scene/GreenBottle.js";
import { PurpleBottle } from "./Scene/PurpleBottle.js";
import { OrangeBottle } from "./Scene/OrangeBottle.js";
import { CyanBottle } from "./Scene/CyanBottle.js";
import { Thunder } from "./Scene/Thunder.js";
import { WaveManager } from "./WaveManager.js";
import { ComboSystem } from "./ComboSystem.js";
import { Minimap } from "./Minimap.js";
import { VisualEffects } from "./VisualEffects.js";
import { AchievementSystem } from "./AchievementSystem.js";
import { DifficultyManager } from "./DifficultyManager.js";
import { Shotgun } from "./Scene/Shotgun.js";
import { Boomerang } from "./Scene/Boomerang.js";

export class Level extends Scene{
  constructor() {
    super({ key: 'Level' });
  }

  startAnimation;
	targetPosStartAnimation = 64;
	door;
  player;
  enemiesList = [
    (x, y) => new Slime(this, x, y),
    (x, y) => new Goblin(this, x, y),
    (x, y) => new Fly(this, x, y),
    (x, y) => new TankEnemy(this, x, y),
    (x, y) => new SpeedEnemy(this, x, y),
    (x, y) => new RangedEnemy(this, x, y),
  ];
  enemies = [];
  waveManager = null;
  useWaveSystem = true; // Imposta a false per il vecchio sistema di spawn
  bottleList = [
    (x, y) => new RedBottle (this, x, y),
    (x, y) => new YellowBottle(this, x, y),
    (x, y) => new BlueBottle(this, x, y),
    (x, y) => new GreenBottle(this, x, y),
    (x, y) => new PurpleBottle(this, x, y, this.enemies),
    (x, y) => new OrangeBottle(this, x, y),
    (x, y) => new CyanBottle(this, x, y),
  ];
  bottles = [];
  attacks = [];
  boomerangs = []; // Array separato per boomerang (hanno update)
  comboSystem = null;
  totalScore = 0; // Punteggio con moltiplicatore combo
  minimap = null;
  visualEffects = null;
  achievementSystem = null;
  potionsCollected = 0;
  difficultyManager = null;
  immunity = false;
  immuneDuration = 7000;
  lastCollisionTime = 0;
  shield;
  scoreText = " ";
  enemyCounter = 0;
  isPaused = false;
  pauseText = null;
  pauseOverlay = null;
  survivalTime = 0;
  startTime = 0;

  //serve per inizializzare i dati del livello
  init() {
    this.startAnimation = true;
    this.player = null;
    this.enemies = [];
    this.attacks = [];
    this.bottles = [];
    this.boomerangs = [];
    this.isPaused = false;
    this.survivalTime = 0;
    this.startTime = 0;
    this.enemyCounter = 0;
    this.waveManager = null;
    this.comboSystem = null;
    this.totalScore = 0;
    this.minimap = null;
    this.visualEffects = null;
    this.achievementSystem = null;
    this.potionsCollected = 0;
    this.difficultyManager = null;
  }

  //serve per caricare gli assets utilizzati in questo livello
  preload() {
    this.load.spritesheet("knight_idle", "assets/player/knight_idle.png", {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet("knight_run", "assets/player/knight_run.png", {frameWidth: 16, frameHeight: 16});
    
    this.load.spritesheet("fly", "assets/enemy/fly.png", {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet("goblin", "assets/enemy/goblin.png", {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet("slime", "assets/enemy/slime.png", {frameWidth: 16, frameHeight: 16});

    this.load.spritesheet("sword", "assets/player/sword.png", {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet("laser", "assets/player/laser.png", {frameWidth: 16, frameHeight: 16});

    this.load.spritesheet("potion", "assets/potions/red_potion.png", {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet("yellow_potion", "assets/potions/yellow_potion.png", {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet("blue_potion", "assets/potions/azure_potion.png", {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet("green_potion", "assets/potions/green_potion.png", {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet("purple_potion", "assets/potions/purple_potion.png", {frameWidth: 16, frameHeight: 16});

    this.load.spritesheet("death", "assets/enemy/explosion-6.png", {frameWidth: 48, frameHeight: 48});
    this.load.spritesheet("thunder", "assets/enemy/electro_ray.png", {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet("shield1", "assets/player/shield1.png", {frameWidth: 64, frameHeight: 64});

    this.load.spritesheet("door", "assets/door.png", { frameWidth: 32, frameHeight: 32 })
    this.load.tilemapTiledJSON("tilemap", "assets/Map.json")
		this.load.image("shooter", "assets/tilesheet.png")
    this.load.image("pause_btn", "assets/pauseBtn.png");
  }

  //serve per costruire il livello e le sue entità
  create() {
    // Inizializza il timer di sopravvivenza
    this.startTime = this.time.now;
    
    this.map = this.make.tilemap({ key: "tilemap" });
		this.map.addTilesetImage("shooter");
		this.map.createLayer("Floor", "shooter");
		let wallLayer = this.map.createLayer("Walls", "shooter");
		wallLayer.setCollisionBetween(1, wallLayer.tilesTotal);
		this.map.createLayer("Decorations", "shooter");

    // === HUD MIGLIORATO ===
    this.createHUD(wallLayer);
    
    // === SISTEMA COMBO ===
    this.comboSystem = new ComboSystem(this);
    
    // === MINI-MAPPA ===
    this.minimap = new Minimap(this, 640, 360);
    
    // === EFFETTI VISIVI ===
    this.visualEffects = new VisualEffects(this);
    
    // === SISTEMA ACHIEVEMENT ===
    this.achievementSystem = new AchievementSystem(this);
    
    // === DIFFICOLTÀ DINAMICA ===
    this.difficultyManager = new DifficultyManager(this);

    this.player = new Player(this, 320, 0, "player_idle");
    this.player.setOrigin(0.5, 0.5);
    this.player.setBodySize(8 , 10);
    
    this.door = new Door(this, 320, 16, "door");

    this.shield = new Shield(this, this.player.x, this.player.y, "shield1");
    this.updateShieldVisibility();
    this.shield.play("shield")

    this.time.addEvent({
      delay: 2000,
      loop: true,
      callback : () => {
        let randomIndex = Phaser.Math.Between(0, this.bottleList.length - 1);
        let randomBottle = this.bottles[randomIndex];

        let x = Phaser.Math.Between(0, this.map.widthInPixels);
        let y = Phaser.Math.Between(0, this.map.heightInPixels - 30);

        if (!wallLayer.getTileAtWorldXY(x, y)) {
          let bottle = this.bottleList[randomIndex](x,y)
					this.bottles = [...this.bottles, bottle];
        }

      }
    });    

    // === SISTEMA WAVE O SPAWN CLASSICO ===
    if (this.useWaveSystem) {
      // Nuovo sistema a wave
      this.waveManager = new WaveManager(this);
      // Avvia le wave dopo l'animazione iniziale
      this.time.delayedCall(2000, () => {
        this.waveManager.start();
      });
    } else {
      // Vecchio sistema di spawn continuo
      this.time.addEvent({      
        delay: 200,              
        loop: true,
        callback: () => {
          let x = Phaser.Math.Between(0, 640);
          let y = Phaser.Math.Between(0, 360);     
          if(!this.cameras.main.getBounds().contains(x, y)){
            let enemy = this.enemiesList[Phaser.Math.Between(0, 2)](x,y) // Solo primi 3 nemici
            this.enemies = [...this.enemies, enemy];
          }
        },      
      });
    }

    this.physics.add.collider(this.player, wallLayer);
		this.physics.add.collider(this.player, this.door);
    this.physics.add.collider(this.player, this.bottle);

    this.cameras.main.startFollow(this.player).setZoom(1).setBounds(10, 5, 620, 344)

    // === SISTEMA DI PAUSA ===
    // Overlay scuro per la pausa
    this.pauseOverlay = this.add.rectangle(320, 180, 640, 360, 0x000000, 0.7);
    this.pauseOverlay.setScrollFactor(0);
    this.pauseOverlay.setDepth(100);
    this.pauseOverlay.setVisible(false);

    // Testo PAUSA
    this.pauseText = this.add.text(320, 150, 'PAUSA', {
      fontFamily: 'Arial',
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    this.pauseText.setOrigin(0.5);
    this.pauseText.setScrollFactor(0);
    this.pauseText.setDepth(101);
    this.pauseText.setVisible(false);

    // Testo istruzioni pausa
    this.pauseInstructions = this.add.text(320, 200, 'Premi ESC o P per riprendere', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#cccccc'
    });
    this.pauseInstructions.setOrigin(0.5);
    this.pauseInstructions.setScrollFactor(0);
    this.pauseInstructions.setDepth(101);
    this.pauseInstructions.setVisible(false);

    // === DAMAGE FLASH OVERLAY ===
    this.damageFlash = this.add.rectangle(320, 180, 640, 360, 0xff0000, 0);
    this.damageFlash.setScrollFactor(0);
    this.damageFlash.setDepth(99);

    // Input per pausa (ESC o P)
    this.input.keyboard.on('keydown-ESC', () => this.togglePause());
    this.input.keyboard.on('keydown-P', () => this.togglePause());
  }

  //rappresenta il game loop
  update() {
    // Se in pausa, non eseguire la logica di gioco
    if (this.isPaused) {
      return;
    }

    if (this.startAnimation) {
			this.physics.moveTo(this.player, this.player.x, this.targetPosStartAnimation, this.player.speed)      
			if (this.player.y >= this.targetPosStartAnimation) {
				this.player.setVelocity(0)
				this.startAnimation = false
				this.player.play("idle")
				this.door.play("door");
			}      
		}

    this.enemies.forEach((enemy)=> {
      this.physics.moveToObject(enemy, this.player, 40);
      if (enemy.x > this.player.x) {
        enemy.setFlipX(true)
      } else {
        enemy.setFlipX(false)
      }
    });

    if(this.immunity && this.time.now > this.lastCollisionTime + this.immuneDuration){
      this.immunity = false; // Scaduta l'animazione toglie l'immunità
    }

    // Power Up Bottle Logic
    this.physics.collide(this.player, this.bottles, (player, bottle) => {
      let powerUpName = '';
      let powerUpColor = '#ffffff';

      //Gestisce la bottiglia presa
      if (bottle instanceof YellowBottle) { // Se la bottiglia è gialla , cambia arma
        player.power = true;
        powerUpName = 'Laser';
        powerUpColor = '#ffa500';
        console.log("change Weapon")
      } else if (bottle instanceof RedBottle) {   // Se la bottiglia è rossa, cura il giocatore
        player.power = false;
        player.heal();
        powerUpName = 'Heal';
        powerUpColor = '#ff0000';
      } else if (bottle instanceof GreenBottle) { // Se la bottliglia è verde aumenta la velocità del giocatore
        const speedBoost = 120;
        this.player.speed += speedBoost;
        powerUpName = 'Speed';
        powerUpColor = '#00ff00';                
        this.time.delayedCall(5000, () => {
          this.player.speed -= speedBoost; // Fix: ora rimuove la stessa quantità aggiunta
        });
        console.log(this.player.speed);
      } else if (bottle instanceof BlueBottle) { // Se la bottiglie è blu, fornisce immunità        
        if(!this.immunity){
          this.immunity = true;
          this.lastCollisionTime = this.time.now;
          this.shield = new Shield(this, player.x, player.y, "shield1");          
        }
        powerUpName = 'Shield';
        powerUpColor = '#0000ff';        
      } else if (bottle instanceof OrangeBottle) { // Shotgun arma
        player.weaponType = 'shotgun';
        powerUpName = 'Shotgun';
        powerUpColor = '#ff8800';
        // Durata 10 secondi
        this.time.delayedCall(10000, () => {
          if (player.weaponType === 'shotgun') {
            player.weaponType = 'normal';
          }
        });
      } else if (bottle instanceof CyanBottle) { // Boomerang arma
        player.weaponType = 'boomerang';
        powerUpName = 'Boomerang';
        powerUpColor = '#00ffff';
        // Durata 10 secondi
        this.time.delayedCall(10000, () => {
          if (player.weaponType === 'boomerang') {
            player.weaponType = 'normal';
          }
        });
      } else if (bottle instanceof PurpleBottle) {   // Se la bottiglia è viola colpisce tutti i nemici sullo schermo       
        this.enemies.forEach((enemy) => {
          new Thunder(this, enemy.x, enemy.y);
          enemy.die("thunder");
          this.enemyCounter++;
          this.scoreText.setText('You killed: ' + this.enemyCounter , {fontSize: 20, color: 'white'});
          
          // Notifica WaveManager per ogni nemico ucciso
          if (this.waveManager) {
            this.waveManager.onEnemyKilled();
          }
        });
        powerUpName = 'Thunder';
        powerUpColor = '#800080';                      
      } else {  // Se la bottiglia non è riconosciuta, stampa un messaggio di errore
        console.log("Bottiglia non riconosciuta");
      }

      // Effetto particelle alla raccolta
      const colorMap = {
        '#ff0000': 0xff0000, '#ffa500': 0xffa500, '#00ff00': 0x00ff00,
        '#0000ff': 0x0000ff, '#800080': 0x800080, '#ffffff': 0xffffff
      };
      this.showPickupEffect(bottle.x, bottle.y, colorMap[powerUpColor] || 0xffffff);
      
      // Incrementa contatore pozioni per achievement
      this.potionsCollected++;

      const powerUpText = this.add.text(this.player.x, this.player.y - 50, powerUpName, {
        fontSize: '10px',
        fill: powerUpColor
      });
      powerUpText.setOrigin(0.5, 0.5);

      // Aggiorna la posizione del testo in base alla posizione del giocatore
      const textUpdate = this.time.addEvent({
        delay: 16, // Circa 60 FPS
        callback: () => {
          powerUpText.setPosition(this.player.x, this.player.y - 20);
        },
        loop: true
      });
      
      this.time.delayedCall(1000, () => {
        powerUpText.destroy();
        textUpdate.remove(false);
      });

      bottle.destroy();    // Distrugge la bottiglia con cui il giocatore ha collidito

    // Rimuove la bottiglia dall'array bottles
      this.bottles = this.bottles.filter(b => b !== bottle);      
      console.log(`your speed: ${this.player.speed}`);
      return this.enemyCounter;
    });

    // Set Shield position
    if(this.shield) {
      this.shield.updatePosition(this.player.x, this.player.y);
    };

    // Health Bar Dynamic
    this.physics.collide(this.player, this.enemies, (player, enemy)=>{
      if(this.immunity == false){
        this.player.takeDamage(enemy.enemyDmg);
        
        // === FEEDBACK VISIVI ===
        // Screen shake
        this.cameras.main.shake(100, 0.01);
        
        // Flash rosso sul bordo
        this.showDamageFlash();
      }
      this.player.updateHPBar();
      if (this.player.currentHP <= 0) {
        // Calcola tempo di sopravvivenza
        this.survivalTime = (this.time.now - this.startTime) / 1000;
        
        // Vai alla scena GameOver passando i dati
        this.scene.start('GameOver', {
          score: this.enemyCounter,
          time: this.survivalTime
        });
      }
      console.log(player.currentHP);
    })

    // Death Animation - Sistema HP nemici
    this.physics.collide(this.attacks, this.enemies, (attack, enemy)=>{
      const baseDamage = this.player.power ? 15 : 25; // Laser = 15, Sword = 25
      const attackDamage = this.player.getTotalDamage(baseDamage);
      const isDead = enemy.takeDamage(attackDamage);
      
      // Rimuovi l'attacco dall'array e distruggilo
      this.attacks = this.attacks.filter(a => a !== attack);
      attack.destroy();
      
      if (isDead) {
        new DeathAnim(this, enemy.x, enemy.y);
        
        // Effetto particelle morte
        if (this.visualEffects) {
          // Determina tipo nemico per colore particelle
          let enemyType = 'default';
          if (enemy.constructor.name === 'Slime') enemyType = 'slime';
          else if (enemy.constructor.name === 'Goblin') enemyType = 'goblin';
          else if (enemy.constructor.name === 'Fly') enemyType = 'fly';
          else if (enemy.constructor.name === 'TankEnemy') enemyType = 'tank';
          else if (enemy.constructor.name === 'SpeedEnemy') enemyType = 'speed';
          else if (enemy.constructor.name === 'RangedEnemy') enemyType = 'ranged';
          
          this.visualEffects.createDeathParticles(enemy.x, enemy.y, enemyType);
        }
        
        // Dai XP al player
        const xpReward = enemy.xpReward || 10;
        this.player.addXP(xpReward);
        
        // Sistema combo - ottieni moltiplicatore
        const comboMultiplier = this.comboSystem ? this.comboSystem.onKill() : 1;
        const scoreGain = Math.floor(10 * comboMultiplier);
        this.totalScore += scoreGain;
        
        enemy.die();
        this.enemyCounter++;
        console.log(`Kill: ${this.enemyCounter} | Score: ${this.totalScore} (x${comboMultiplier})`);
        this.scoreText.setText('💀 ' + this.enemyCounter, {fontSize: 20, color: 'white'});
        
        // Notifica WaveManager
        if (this.waveManager) {
          this.waveManager.onEnemyKilled();
        }
      }
    });

    this.updateShieldVisibility();    
    this.player.updateHPBar();
    
    // Aggiorna le HP bar dei nemici
    this.enemies.forEach((enemy) => {
      if (enemy.updateHPBar) {
        enemy.updateHPBar();
      }
    });
    
    // Aggiorna i boomerang
    this.boomerangs.forEach((boomerang) => {
      if (boomerang && boomerang.active && boomerang.update) {
        boomerang.update();
      }
    });
    // Rimuovi boomerang distrutti
    this.boomerangs = this.boomerangs.filter(b => b && b.active);
    
    // Aggiorna mini-mappa
    if (this.minimap) {
      this.minimap.update();
    }
    
    // Aggiorna effetti visivi (trail, ecc.)
    if (this.visualEffects) {
      this.visualEffects.update();
    }
    
    // Check achievement ogni secondo circa
    if (this.achievementSystem && Math.floor(this.time.now / 1000) !== this.lastAchievementCheck) {
      this.lastAchievementCheck = Math.floor(this.time.now / 1000);
      const stats = AchievementSystem.getStatsFromScene(this);
      this.achievementSystem.checkAchievements(stats);
    }
    
    // Aggiorna difficoltà dinamica
    if (this.difficultyManager) {
      const elapsedTime = (this.time.now - this.startTime) / 1000;
      this.difficultyManager.update(elapsedTime, this.enemyCounter);
    }
    
    // Aggiorna HUD
    this.updateHUD();
    return;   
  }

  updateShieldVisibility() {
    this.shield.setVisible(this.immunity);
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      // Pausa il gioco
      this.physics.pause();
      this.pauseOverlay.setVisible(true);
      this.pauseText.setVisible(true);
      this.pauseInstructions.setVisible(true);
    } else {
      // Riprendi il gioco
      this.physics.resume();
      this.pauseOverlay.setVisible(false);
      this.pauseText.setVisible(false);
      this.pauseInstructions.setVisible(false);
    }
  }

  // Crea l'HUD del gioco
  createHUD(wallLayer) {
    const hudDepth = wallLayer.depth + 10;
    
    // Sfondo HUD in alto
    this.hudBg = this.add.rectangle(320, 12, 640, 24, 0x000000, 0.5);
    this.hudBg.setScrollFactor(0);
    this.hudBg.setDepth(hudDepth);

    // Score (sinistra)
    this.scoreText = this.add.text(10, 5, '💀 0', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff'
    });
    this.scoreText.setScrollFactor(0);
    this.scoreText.setDepth(hudDepth + 1);

    // Timer (centro)
    this.timerText = this.add.text(320, 5, '⏱️ 0:00', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff'
    });
    this.timerText.setOrigin(0.5, 0);
    this.timerText.setScrollFactor(0);
    this.timerText.setDepth(hudDepth + 1);

    // Arma corrente (destra)
    this.weaponText = this.add.text(630, 5, '⚔️ Spada', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff'
    });
    this.weaponText.setOrigin(1, 0);
    this.weaponText.setScrollFactor(0);
    this.weaponText.setDepth(hudDepth + 1);

    // HP Bar grande in basso
    this.hpBarBg = this.add.rectangle(320, 350, 200, 8, 0x333333);
    this.hpBarBg.setScrollFactor(0);
    this.hpBarBg.setDepth(hudDepth);

    this.hpBarFill = this.add.rectangle(221, 350, 198, 6, 0xff0000);
    this.hpBarFill.setOrigin(0, 0.5);
    this.hpBarFill.setScrollFactor(0);
    this.hpBarFill.setDepth(hudDepth + 1);

    this.hpText = this.add.text(320, 350, '1000/1000', {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: '#ffffff'
    });
    this.hpText.setOrigin(0.5);
    this.hpText.setScrollFactor(0);
    this.hpText.setDepth(hudDepth + 2);
  }

  // Aggiorna l'HUD ogni frame
  updateHUD() {
    // Aggiorna score
    this.scoreText.setText('💀 ' + this.enemyCounter);

    // Aggiorna timer
    const elapsed = (this.time.now - this.startTime) / 1000;
    const minutes = Math.floor(elapsed / 60);
    const seconds = Math.floor(elapsed % 60);
    this.timerText.setText(`⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`);

    // Aggiorna arma
    if (this.player) {
      let weaponName = '⚔️ Spada';
      let weaponColor = '#ffffff';
      
      if (this.player.weaponType === 'shotgun') {
        weaponName = '🔥 Shotgun';
        weaponColor = '#ff8800';
      } else if (this.player.weaponType === 'boomerang') {
        weaponName = '🪃 Boomerang';
        weaponColor = '#00ffff';
      } else if (this.player.power) {
        weaponName = '🔫 Laser';
        weaponColor = '#ffff00';
      }
      
      this.weaponText.setText(weaponName);
      this.weaponText.setColor(weaponColor);
    }

    // Aggiorna HP bar
    if (this.player) {
      const hpPercent = this.player.currentHP / this.player.maxHP;
      this.hpBarFill.setScale(hpPercent, 1);
      this.hpText.setText(`${this.player.currentHP}/${this.player.maxHP}`);
      
      // Cambia colore in base agli HP
      if (hpPercent > 0.6) {
        this.hpBarFill.setFillStyle(0x00ff00); // Verde
      } else if (hpPercent > 0.3) {
        this.hpBarFill.setFillStyle(0xffff00); // Giallo
      } else {
        this.hpBarFill.setFillStyle(0xff0000); // Rosso
      }
    }
  }

  // Mostra flash rosso quando si prende danno
  showDamageFlash() {
    if (!this.damageFlash) return;
    
    // Flash rosso rapido
    this.tweens.add({
      targets: this.damageFlash,
      alpha: { from: 0.4, to: 0 },
      duration: 150,
      ease: 'Power2'
    });
  }

  // Effetto particelle quando si raccoglie una pozione
  showPickupEffect(x, y, color) {
    // Crea particelle semplici con cerchi
    for (let i = 0; i < 8; i++) {
      const particle = this.add.circle(x, y, 3, color);
      const angle = (i / 8) * Math.PI * 2;
      const distance = 20;
      
      this.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0,
        duration: 300,
        onComplete: () => particle.destroy()
      });
    }
  }
}