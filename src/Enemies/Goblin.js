import { Physics } from "phaser";

export class Goblin extends Physics.Arcade.Sprite{
  enemyHP = 40;
  enemyDmg = 20;

  constructor(scene, x, y, texture = "goblin"){
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);  
  
    scene.anims.create({
      key: "goblin_run",
      repeat: -1,
      frameRate: 6,
      frames: scene.anims.generateFrameNumbers(texture, {
        start: 0,
        end: 5,
      })
    });

    this.scene.physics.add.overlap(this, this.player, () => {
      this.player.takeDamage(this.enemyDmg);
    });

    this.play("goblin_run");
  };

  die() {
    this.scene.enemies.splice(this.scene.enemies.indexOf(this),1)
		this.destroy();
	}
}
