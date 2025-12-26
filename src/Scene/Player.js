import { Physics } from "phaser";
import { Sword } from "./Sword";
import { Beam } from "./Beam";
import { Shotgun } from "./Shotgun";
import { Boomerang } from "./Boomerang";



export class Player extends Physics.Arcade.Sprite{
  speed = 80;
  baseSpeed = 80;
  maxHP = 1000; // HP massimi del giocatore
  currentHP = this.maxHP; // HP attuali del giocatore
  hpBar; // Barra degli HP
  power = false;
  weaponType = 'normal'; // normal, shotgun, boomerang
  
  // === SISTEMA XP E LEVEL ===
  level = 1;
  currentXP = 0;
  xpToNextLevel = 100;
  xpMultiplier = 1.5; // Moltiplicatore XP per ogni livello
  
  // Stats bonus per level up
  bonusDamage = 0;
  bonusSpeed = 0;
  bonusMaxHP = 0;


  constructor(scene, x, y, texture = "knight_idle"){
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Aggiungi la barra degli HP sopra il giocatore
    this.hpBar = scene.add.graphics();
    this.updateHPBar();
    
    // Crea UI per XP/Level
    this.createLevelUI(scene);

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
      
      // Sistema armi avanzato
      if (this.weaponType === 'shotgun') {
        // Shotgun: 3 proiettili a ventaglio
        const projectiles = Shotgun.createSpread(pointer, scene, this.x, this.y, angle);
        projectiles.forEach(p => scene.attacks.push(p));
      } else if (this.weaponType === 'boomerang') {
        // Boomerang: torna indietro
        let attack = new Boomerang(pointer, scene, this.x, this.y, angle);
        scene.attacks.push(attack);
        scene.boomerangs.push(attack);
      } else if (this.power === true) {
        // Laser (pozione gialla)
        let attack = new Beam(pointer, scene, this.x, this.y, angle, "laser");
        scene.attacks.push(attack);
      } else {
        // Spada normale
        let attack = new Sword(pointer, scene, this.x, this.y, angle);
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
  
  // === SISTEMA XP E LEVEL UP ===
  
  /**
   * Crea l'UI per mostrare livello e XP
   */
  createLevelUI(scene) {
    // Container per XP bar (in basso a sinistra)
    this.levelText = scene.add.text(10, 335, `Lv.${this.level}`, {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: '#ffcc00',
      fontStyle: 'bold'
    });
    this.levelText.setScrollFactor(0);
    this.levelText.setDepth(50);
    
    // Barra XP
    this.xpBarBg = scene.add.rectangle(70, 338, 80, 6, 0x333333);
    this.xpBarBg.setScrollFactor(0);
    this.xpBarBg.setDepth(50);
    
    this.xpBarFill = scene.add.rectangle(31, 338, 78, 4, 0x00ccff);
    this.xpBarFill.setOrigin(0, 0.5);
    this.xpBarFill.setScrollFactor(0);
    this.xpBarFill.setDepth(51);
    
    this.updateXPBar();
  }
  
  /**
   * Aggiunge XP al player
   */
  addXP(amount) {
    this.currentXP += amount;
    
    // Mostra +XP text
    this.showXPGain(amount);
    
    // Check level up
    while (this.currentXP >= this.xpToNextLevel) {
      this.levelUp();
    }
    
    this.updateXPBar();
  }
  
  /**
   * Mostra il guadagno XP sopra il player
   */
  showXPGain(amount) {
    const xpText = this.scene.add.text(this.x, this.y - 25, `+${amount} XP`, {
      fontFamily: 'Arial',
      fontSize: '8px',
      color: '#00ccff',
      fontStyle: 'bold'
    });
    xpText.setOrigin(0.5);
    xpText.setDepth(100);
    
    this.scene.tweens.add({
      targets: xpText,
      y: xpText.y - 20,
      alpha: 0,
      duration: 800,
      onComplete: () => xpText.destroy()
    });
  }
  
  /**
   * Level Up!
   */
  levelUp() {
    this.currentXP -= this.xpToNextLevel;
    this.level++;
    this.xpToNextLevel = Math.floor(this.xpToNextLevel * this.xpMultiplier);
    
    // Bonus stats per level
    this.bonusDamage += 2;
    this.bonusSpeed += 3;
    this.bonusMaxHP += 50;
    
    // Applica bonus
    this.baseSpeed += 3;
    this.speed = this.baseSpeed;
    this.maxHP += 50;
    this.currentHP = Math.min(this.currentHP + 50, this.maxHP); // Cura parziale
    
    // Effetto Level Up
    this.showLevelUpEffect();
    
    console.log(`LEVEL UP! Now level ${this.level}`);
  }
  
  /**
   * Effetto visivo del level up
   */
  showLevelUpEffect() {
    // Flash dorato sul player
    this.setTint(0xffcc00);
    this.scene.time.delayedCall(200, () => {
      this.clearTint();
    });
    
    // Testo LEVEL UP
    const levelUpText = this.scene.add.text(this.x, this.y - 40, '⬆️ LEVEL UP!', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffcc00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 2
    });
    levelUpText.setOrigin(0.5);
    levelUpText.setDepth(100);
    
    this.scene.tweens.add({
      targets: levelUpText,
      y: levelUpText.y - 30,
      scale: 1.5,
      alpha: 0,
      duration: 1500,
      onComplete: () => levelUpText.destroy()
    });
    
    // Particelle dorate
    for (let i = 0; i < 12; i++) {
      const particle = this.scene.add.circle(this.x, this.y, 4, 0xffcc00);
      const angle = (i / 12) * Math.PI * 2;
      
      this.scene.tweens.add({
        targets: particle,
        x: this.x + Math.cos(angle) * 40,
        y: this.y + Math.sin(angle) * 40,
        alpha: 0,
        scale: 0,
        duration: 500,
        onComplete: () => particle.destroy()
      });
    }
    
    // Screen shake leggero
    this.scene.cameras.main.shake(150, 0.005);
  }
  
  /**
   * Aggiorna la barra XP
   */
  updateXPBar() {
    if (this.levelText) {
      this.levelText.setText(`Lv.${this.level}`);
    }
    
    if (this.xpBarFill) {
      const xpPercent = this.currentXP / this.xpToNextLevel;
      this.xpBarFill.setScale(xpPercent, 1);
    }
  }
  
  /**
   * Ottieni il danno totale (base + bonus)
   */
  getTotalDamage(baseDamage) {
    return baseDamage + this.bonusDamage;
  }
}