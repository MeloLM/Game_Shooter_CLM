import { Scene, Math } from "phaser";
import { Player } from "./Scene/Player.js";
import { Fly } from "./Enemies/Fly.js";
import { Goblin } from "./Enemies/Goblin.js";
import { Slime } from "./Enemies/Slime.js";
import { Door } from "./Scene/Door.js";
import { DeathAnim } from "./Scene/DeathAnim.js";
import { RedBottle } from "./Scene/RedBottle.js";
import { YellowBottle } from "./Scene/YellowBottle.js";
import { BlueBottle } from "./Scene/BlueBottle.js";
import { Shield } from "./Scene/Shield.js";

export class Level extends Scene{
  startAnimation;
	targetPosStartAnimation = 64;
	door;
  player;
  bottleList = [
    (x, y) => new RedBottle (this, x, y),
    (x, y) => new YellowBottle(this, x, y),
    (x, y) => new BlueBottle(this, x, y),
  ];
  bottles = [];
  enemiesList = [
    (x, y) => new Slime(this, x, y),
    (x, y) => new Goblin(this, x, y),
    (x, y) => new Fly(this, x, y ),
  ];
  enemies = [];
  attacks = [];
  immunity = false;
  immuneDuration = 7000;
  lastCollisionTime = 0;
  shield;
  

  //serve per inizializzare i dati del livello
  init() {
    this.startAnimation = true;
    this.player = null;
    this.enemies = [];
    this.attacks = [];
    this.bottles = [];
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
    this.load.spritesheet("death", "assets/enemy/explosion-6.png", {frameWidth: 48, frameHeight: 48});
    this.load.spritesheet("potion", "assets/potions/red_potion.png", {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet("yellow_potion", "assets/potions/yellow_potion.png", {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet("blue_potion", "assets/potions/azure_potion.png", {frameWidth: 16, frameHeight: 16});
    this.load.spritesheet("shield1", "assets/player/shield1.png", {frameWidth: 48, frameHeight: 48});

    this.load.spritesheet("door", "assets/door.png", { frameWidth: 32, frameHeight: 32 })
    this.load.tilemapTiledJSON("tilemap", "assets/Map.json")
		this.load.image("shooter", "assets/tilesheet.png")
  }

  //serve per costruire il livello e le sue entità
  create() {
    this.map = this.make.tilemap({ key: "tilemap" });
		this.map.addTilesetImage("shooter");
		this.map.createLayer("Floor", "shooter");
		let wallLayer = this.map.createLayer("Walls", "shooter");
		wallLayer.setCollisionBetween(1, wallLayer.tilesTotal);
		this.map.createLayer("Decorations", "shooter");

    this.player = new Player(this, 320, 0, "player_idle");
    this.player.setOrigin(0.5, 0.5);
    this.player.setBodySize(8 , 10);
    
    this.door = new Door(this, 320, 16, "door");

    this.shield = new Shield(this, this.player.x, this.player.y, "shield1");
    this.updateShieldVisibility();
    this.shield.play("shield")

    this.time.addEvent({
      delay: 5000,
      loop: true,
      callback : () => {
        let randomIndex = Math.Between(0, this.bottleList.length - 1);
        let randomBottle = this.bottles[randomIndex];

        let x = Phaser.Math.Between(0, this.map.widthInPixels);
        let y = Phaser.Math.Between(0, this.map.heightInPixels);

        if (!wallLayer.getTileAtWorldXY(x, y)) {
          let bottle = this.bottleList[randomIndex](x,y)
					this.bottles = [...this.bottles, bottle];
        }

      }
    });

    this.time.addEvent({
      delay: 200,
      loop: true,
      callback: () => {
        let x = Math.Between(0, 640);
				let y = Math.Between(0, 360);     
        if(!this.cameras.main.getBounds().contains(x, y)){
					let enemy = this.enemiesList[Math.Between(0, this.enemiesList.length - 1)](x,y)
					this.enemies = [...this.enemies, enemy];
				}
      },
    });


    this.physics.add.collider(this.player, wallLayer);
		this.physics.add.collider(this.player, this.door);
    this.physics.add.collider(this.player, this.bottle);

    this.cameras.main.startFollow(this.player).setZoom(1).setBounds(10, 5, 620, 344)
  }

  //rappresenta il game loop
  update() {
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

    // if(this.immunity && this.time.now > this.lastCollisionTime + this.immuneDuration){
    //   this.immunity = false; // Scaduta l'animazione toglie l'immunità
    // }

    this.physics.collide(this.player, this.bottles, (player, bottle) => {
      //Gestisce la bottiglia presa
      if (bottle instanceof YellowBottle) { // Se la bottiglia è gialla , cambia arma
        player.power = true;
        console.log("change Weapon")
      } else if (bottle instanceof RedBottle) {   // Se la bottiglia è rossa, cura il giocatore
        player.power = false;
        player.heal();
      } else if (bottle instanceof BlueBottle) { // Se la bottiglie è blu, fornisce immunità
        player.power = false;
        if(!this.immunity){
          this.immunity = true;
          this.lastCollisionTime = this.time.now;
        }
        console.log("Effetto blue potion")
      } else {  // Se la bottiglia non è riconosciuta, stampa un messaggio di errore
        console.log("Bottiglia non riconosciuta");
      }
      bottle.destroy();    // Distrugge la bottiglia con cui il giocatore ha collidito

    // Rimuove la bottiglia dall'array bottles
      this.bottles = this.bottles.filter(b => b !== bottle);
      console.log(player.currentHP);
    });

    // this.shield.setPosition(this.player.x, this.player.y - 20);

    this.physics.collide(this.player, this.enemies, (player, enemy)=>{
      if(this.immunity == false){
        this.player.takeDamage(enemy.enemyDmg)
      }
      this.player.updateHPBar();
      if (this.player.currentHP == 0) {
      this.scene.restart();
    }
      console.log(player.currentHP);
    })

    this.physics.collide(this.attacks, this.enemies, (attack, enemy)=>{
      new DeathAnim(this, enemy.x, enemy.y)
      enemy.die("death");
      attack.destroy();
    });

    this.updateShieldVisibility();

    

    this.player.updateHPBar();
  }
  updateShieldVisibility() {
      this.shield.setVisible(this.immunity);
  };
}