import { Physics } from "phaser";
import { Sword } from "./Sword";
import { Beam } from "./Beam";



export class Player extends Physics.Arcade.Sprite{
  speed = 80;
  maxHP = 1000; // HP massimi del giocatore
  currentHP = this.maxHP; // HP attuali del giocatore
  hpBar; // Barra degli HP
  power = false;


  constructor(scene, x, y, texture = "knight_idle"){
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Aggiungi la barra degli HP sopra il giocatore
    this.hpBar = scene.add.graphics();
    this.updateHPBar();

  // ANIMAZIONI PLAYER
    scene.anims.create({
      key: "player_idle",
      frameRate: 6,
      repeat: -1 ,
      frames: scene.anims.generateFrameNumbers("knight_idle", {
        start: 0,
        end: 5,
      })
    })

    scene.anims.create({
      key: "player_run",
      frameRate: 6,
      repeat: -1 ,
      frames: scene.anims.generateFrameNumbers("knight_run", {
        start: 0,
        end: 5,
      })
    })

    this.play("player_idle");

  // Y
    scene.input.keyboard.on('keydown-S',()=>{
      this.setVelocityY(this.speed);
      this.updateAnimation();
    })
    scene.input.keyboard.on('keyup-S',()=>{
      this.setVelocityY(0);
      this.updateAnimation();
    })

    scene.input.keyboard.on('keydown-W',()=>{
      this.setVelocityY(-this.speed);
      this.updateAnimation();
    })
    scene.input.keyboard.on('keyup-W',()=>{
      this.setVelocityY(0);
      this.updateAnimation();
    })

  // X
    scene.input.keyboard.on('keydown-A',()=>{
      this.setVelocityX(-this.speed);
      this.updateAnimation();
      this.setFlipX(true);
    })
    scene.input.keyboard.on('keyup-A',()=>{
      this.setVelocityX(0);
      this.updateAnimation();
    })

    scene.input.keyboard.on('keydown-D',()=>{
      this.setVelocityX(this.speed);
      this.updateAnimation();
      this.setFlipX(false)
    })
    scene.input.keyboard.on('keyup-D',()=>{
      this.setVelocityX(0);
      this.updateAnimation();
    })

    // ATTACK
    scene.input.on('pointerdown', (pointer)=>{
      let angle = Phaser.Math.Angle.Between(this.x, this.y, pointer.worldX, pointer.worldY);
      if(this.power == false){
        let attack = new Sword(pointer, scene, this.x, this.y, angle);
        scene.attacks.push(attack);
      } else {
        let attack = new Beam(pointer, scene, this.x, this.y, angle, "laser");
        scene.attacks.push(attack);
      }
    });
  }

   // Aggiorna la barra degli HP in base agli HP attuali del giocatore
  updateHPBar() {
    this.hpBar.clear();

    // Disegna lo sfondo grigio
    this.hpBar.fillStyle(0x808080, 1); 
    const barWidth = 15; // Larghezza fissa della barra degli HP
    const barHeight = 2;
    this.hpBar.fillRect(this.x - barWidth / 2, this.y - 8 - barHeight, barWidth, barHeight);

    // Disegna la barra degli HP rossa sopra lo sfondo grigio
    this.hpBar.fillStyle(0xff0000, 1); 
    const hpWidth = barWidth * (this.currentHP / this.maxHP); // Larghezza proporzionale alla quantità di HP attuali
    this.hpBar.fillRect(this.x - barWidth / 2, this.y - 8 - barHeight, hpWidth, barHeight);
  }

   // Riduci gli HP del giocatore quando subisce danni
  takeDamage(dmg) {
    this.currentHP -= dmg;  
  }

  // Aumenta gli HP del giocatore quando viene curato
  heal(healAmount = 200) {
    if (this.currentHP < this.maxHP) {
        this.currentHP += healAmount;
        if (this.currentHP > this.maxHP) {
            this.currentHP = this.maxHP;
        }
        console.log("Healed by", healAmount);
    } else {
        console.log("Full life");
    }
    this.updateHPBar();
}

  updateAnimation(){
    if (this.body.velocity.x != 0 || this.body.velocity.y != 0) {
        this.play("player_run", true)
      } else {
        this.play("player_idle",true)
      };
  }
}